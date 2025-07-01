const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    const { Employees, Roles } = this.entities;
    
    this.before(['CREATE', 'UPDATE'], Employees, async (req) => {
        if (!req.data.role_ID || !req.data.hireDate) return;
        
        const role = await SELECT.one.from(Roles).where({ ID: req.data.role_ID });
        if (!role) return;
        
        const hireDate = new Date(req.data.hireDate);
        const currentDate = new Date();
        const yearsOfService = Math.floor(
            (currentDate - hireDate) / (1000 * 60 * 60 * 24 * 365)
        );
        
        const bonusPerYear = 1000;
        req.data.salary = parseFloat(role.baseSalary) + (yearsOfService * bonusPerYear);
    });
    
    this.after('READ', Employees, (employees) => {
        if (!Array.isArray(employees)) employees = [employees];
        
        employees.forEach(employee => {
            if (employee.role && employee.hireDate) {
                const hireDate = new Date(employee.hireDate);
                const currentDate = new Date();
                const yearsOfService = Math.floor(
                    (currentDate - hireDate) / (1000 * 60 * 60 * 24 * 365)
                );
                
                const bonusPerYear = 1000;
                employee.salary = parseFloat(employee.role.baseSalary) + (yearsOfService * bonusPerYear);
            }
        });
        
        return employees;
    });
});