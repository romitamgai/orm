# ORM using nodejs
1. Go to the project folder and run: npm install
2. Change the database config in config.js according to your mysql credentials
3. Create employee table with fields id, name, designation, about_employee, created_at, updated_at, salary
4. Run: npm start
5. open the api in localhost:3000/employee
6. Use the select queries:
  - localhost:3000/employee?name=Romit which is equivalent to "Select * from employee where name='Romit'"
  - localhost:3000/employee?name[like]=%a% which is equivalent to "Select * from employee where name like '%a%'"
  - localhost:3000/employee?name[like]=%a%&sort[desc]=name which is equivalent to "Select * from employee where name like '%a%' order by name desc"
  - localhost:3000/employee?start=1&offset=10 which is equivalent to "Select * from employee limit 1,10"
7. Custom query builder is on the branch custom-query-builder
