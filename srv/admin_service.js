const cds = require('@sap/cds');

module.exports = class AdminService extends cds.ApplicationService {
  init() {
    this.before(['READ', 'DELETE', 'CREATE', 'UPDATE'], 'Employees', (req) => {
      const companyCode = req.user.attr?.companyCode?.[0];
      const departmentName = req.user.attr?.departmentName?.[0];
      const roles = Object.keys(req.user.roles || {});
      const isAdmin = roles.includes('Admin');
      const isSuperAdmin = roles.includes('superAdmin');
      const isDeptLead = roles.includes('Department Lead');
      const isEmployee = roles.includes('Employee');

      if (!(isAdmin || isDeptLead)) {
        return req.reject(403, 'Not authorized');
      }

      if (isDeptLead && !isAdmin) {
        if (['READ'].includes(req.event)) {
          req.query.where('departmentName =', departmentName);
        }

        if (['CREATE', 'UPDATE'].includes(req.event)) {
          const entries = Array.isArray(req.data) ? req.data : [req.data];
          for (const entry of entries) {
            if (entry.departmentName !== departmentName) {
              return req.reject(403, `Not allowed to modify data for departmentName: ${entry.departmentName}`);
            }
          }
        }
      }

      if (isAdmin && companyCode && companyCode !== '*') {
        if (['READ'].includes(req.event)) {
          req.query.where('companyCode =', companyCode);
        }

        if (['CREATE', 'UPDATE'].includes(req.event)) {
          const entries = Array.isArray(req.data) ? req.data : [req.data];
          for (const entry of entries) {
            if (entry.companyCode !== companyCode) {
              return req.reject(403, `Not allowed to modify data for companyCode: ${entry.companyCode}`);
            }
          }
        }
      }
    });

    return super.init();
  }
};