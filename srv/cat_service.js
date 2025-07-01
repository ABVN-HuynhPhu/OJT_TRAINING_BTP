const cds = require('@sap/cds');

module.exports = class CatService extends cds.ApplicationService {
  init() {
    this.before(['READ', 'DELETE', 'CREATE', 'UPDATE'], 'Employees', (req) => {
      const companyCode = req.user?.attr?.companyCode?.[0];
      const departmentName = req.user?.attr?.departmentName?.[0];

      const isDeptLead = Object.keys(req.user?.roles || {}).includes('Department Lead');
      const isSuperAdmin = Object.keys(req.user?.roles || {}).includes('superAdmin');
      const isEmployee = Object.keys(req.user?.roles || {}).includes('Employee');

      if (!companyCode && !isSuperAdmin && !isEmployee) {
        return req.reject(403, 'Missing companyCode attribute.');
      }

      if (['READ', 'DELETE'].includes(req.event) && !isSuperAdmin && !isEmployee) {
        req.query.where('companyCode =', companyCode);
      }

      if (['CREATE', 'UPDATE'].includes(req.event)) {
        const entries = Array.isArray(req.data) ? req.data : [req.data];
        for (const entry of entries) {
          entry.companyCode ??= companyCode;
          entry.departmentName ??= departmentName;
          if (!isSuperAdmin && !isEmployee && entry.companyCode !== companyCode) {
            return req.reject(403, `Not allowed to modify data for companyCode: ${entry.companyCode}`);
          }
        }
      }
    });
    return super.init();
  }
};