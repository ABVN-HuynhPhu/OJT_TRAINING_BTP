using app.employees as db from '../db/schema';

service EmployeeService @(path: '/employee') {
  entity Roles as projection on db.Roles;
  entity Departments as projection on db.Departments;
  entity Employees as projection on db.Employees {
    *,
    role: redirected to Roles,
    department: redirected to Departments
  };
}

annotate EmployeeService.Employees with {
  firstName   @mandatory;
  lastName    @mandatory;
  email       @mandatory @assert.format: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';
  hireDate    @mandatory;
  role        @mandatory;
  department  @mandatory;
}

annotate EmployeeService.Employees with @(UI: {
  HeaderInfo: {
    TypeName: 'Employee',
    TypeNamePlural: 'Employees',
    Title: { Value: firstName },
    Description: { Value: lastName }
  },
  SelectionFields: [ firstName, lastName, email, role_ID, department_ID ],
  LineItem: [
    { Value: firstName },
    { Value: lastName },
    { Value: email },
    { Value: hireDate },
    { Value: role.name },
    { Value: department.name },
    { Value: salary }
  ],
  Facets: [
    {
      $Type: 'UI.ReferenceFacet',
      Label: 'Employee Details',
      Target: '@UI.FieldGroup#Details'
    }
  ],
  FieldGroup#Details: {
    Data: [
      { Value: firstName },
      { Value: lastName },
      { Value: email },
      { Value: hireDate },
      { Value: role_ID },
      { Value: department_ID },
      { Value: salary }
    ]
  }
});