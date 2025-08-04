const mongoose = require('mongoose');
const readline = require('readline');

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/employeeDB';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
  showMenu();
}).catch(err => console.error('❌ Connection Error:', err));

// Define Schema & Model
const employeeSchema = new mongoose.Schema({
  name: String,
  salary: Number,
  course: String
});
const Employee = mongoose.model('Employee', employeeSchema);

// CLI Setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Menu Function
function showMenu() {
  console.log(`\n--- Employee Management CLI ---
1. Insert Employee
2. View All Employees
3. Delete details
4. View Employees by Salary (Ascending)
5. View Employees by Salary (Descending)
6. Exit
-------------------------------`);
rl.question('Choose an option (1-6): ', handleMenu);
}

// Handle Menu Choices
function handleMenu(choice) {
  switch (choice.trim()) {
    case '1':
      insertEmployee();
      break;
    case '2':
      viewEmployees();
      break;
    case '3':
      deleteEmployee();
      break;
    case '4':
      viewSalariesAscending();
      break;
    case '5':
      viewSalariesDescending();
      break;
    case '6':
            console.log('👋 Exiting...');
            rl.close();
            mongoose.disconnect();
            break;
    default:
      console.log('❌ Invalid choice. Try again.');
      showMenu();
  }
}
// Insert Student
function insertEmployee() {
  rl.question('Enter name: ', name => {
    rl.question('Enter salary: ', salary => {
      rl.question('Enter course: ', course => {
        const employee = new Employee({ name, salary: Number(salary), course });
        employee.save()
          .then(() => {
            console.log('✅ Employee inserted successfully.');
            showMenu();
          })
          .catch(err => {
            console.error('❌ Insert failed:', err);
            showMenu();
          });
      });
    });
  });
}

// View Students
function viewEmployees() {
  Employee.find()
    .then(employees => {
      console.log('\n📄 Employee Records:');
      employees.forEach((s, index) => {
        console.log(`${index + 1}. ${s.name}, Salary: ${s.salary}, Course: ${s.course}, ID: ${s._id}`);
      });
      showMenu();
    })
    .catch(err => {
      console.error('❌ Error fetching employees:', err);
      showMenu();
    });
}
function deleteEmployee() {
  rl.question('Enter Employee ID to delete: ', id => {
    Employee.findByIdAndDelete(id)
      .then(deleted => {
        if (deleted) {
          console.log('🗑️ Employee deleted.');
        } else {
          console.log('❌ No employee found with that ID.');
        }
        showMenu();
      })
      .catch(err => {
        console.error('❌ Delete error:', err);
        showMenu();
      });
    });
}
function viewSalariesAscending() {
  Employee.find().sort({ salary: 1 })
    .then(employees => {
      console.log('\n💰 Employees Sorted by Salary (Ascending):');
      employees.forEach((e, index) => {
        console.log(`${index + 1}. ${e.name}, Salary: ${e.salary}, Course: ${e.course}, ID: ${e._id}`);
      });
      showMenu();
    })
    .catch(err => {
      console.error('❌ Error fetching sorted employees:', err);
      showMenu();
    });
}
function viewSalariesDescending() {
  Employee.find().sort({ salary: -1 }) // -1 for descending
    .then(employees => {
      console.log('\n📉 Employees Sorted by Salary (Descending):');
      employees.forEach((e, index) => {
        console.log(`${index + 1}. ${e.name}, Salary: ${e.salary}, Course: ${e.course}, ID: ${e._id}`);
      });
      showMenu();
    })
    .catch(err => {
      console.error('❌ Error fetching employees:', err);
      showMenu();
    });
}


