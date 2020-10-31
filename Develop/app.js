const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");
const { deflateSync } = require("zlib");

let employees = [];
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

const questions = [
    {
        type: "input",
        message: "Employee's name:",
        name: "name",
        validate: value => {
            let valid = /^[ A-Za-z]*$/.test(value);
            if (value.trim().length && valid) {
                return true;
            }
            else {
                return "Please enter a <Valid NAME>!";
            }
        }
    },
    {
        type: "input",
        message: "Employee's id:",
        name: "id",
        validate: value => {
            let valid = /^(0|[1-9][0-9]*)$/.test(value);
            if (valid) {
                return true;
            }
            else {
                return "Please enter a <Valid ID>!";
            }
        }
    },
    {
        type: "input",
        message: "Employee's email:",
        name: "email",
        validate: value => {
            let valid = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value);
            if (valid) {
                return true;
            }
            else {
                return "Please enter a <Valid EMAIL>!";
            }

        }
    },
    {
        type: "list",
        message: "Employee's role:",
        name: "role",
        choices: ["Engineer", "Intern", "Manager"]
    },
    {
        type: "input",
        message: "Manager's office number:",
        name: "officeNumber",
        when: answer => answer.role === "Manager",
        validate: value => {
            let valid = /^[A-Za-z0-9]*$/.test(value);
            if (valid) {
                return true;
            } else {
                return "Please enter a <Valid OFFICE NUMBER>"
            }
        }
    },
    {
        type: "input",
        message: "GitHub account:",
        name: "github",
        when: answer => answer.role === "Engineer",
        validate: value => {
            let valide = /^[^\s]*$/.test(value);
            if (valide) {
                return true;
            } else {
                return "Please enter a <Valid GITHUB ACCOUNT>"
            }
        }
    },
    {
        type: "input",
        message: "School name:",
        name: "school",
        when: answer => answer.role === "Intern",
        validate: value => {
            let valid = /^[ A-Za-z]*$/.test(value);
            if (value.trim().length && valid) {
                return true;
            } else {
                return "Please enter a <Valid SCHOOL NAME>"
            }
        }
    },
    {
        type: "confirm",
        name: "add",
        message: "Add another employee?"
    }
];

function setEmployee() {
    inquirer
        .prompt(questions)
        .then(function (response) {
            console.log(response);
            switch (response.role) {
                case "Engineer":
                    const newEngineer = new Engineer(response.name.trim(), response.id, response.email, response.github);
                    employees.push(newEngineer);
                    // console.log(employees);
                    break;
                case "Manager":
                    const newManager = new Manager(response.name.trim(), response.id, response.email, response.officeNumber);
                    employees.push(newManager);
                    break;
                case "Intern":
                    const newIntern = new Intern(response.name.trim(), response.id, response.email, response.school);
                    employees.push(newIntern);
                    break;
            }
            if (response.add) {
                setEmployee();
            }
            else {
                // let renderedHtml = render(employees);
                // if (!fs.existsSync(OUTPUT_DIR)) {
                //     fs.mkdir(OUTPUT_DIR);
                // }
                // fs.writeFile(outputPath, renderedHtml);
                writeTeam();
            }
            // console.log(employees);
        })
}

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

function writeTeam() {
    let renderedHtml = render(employees);
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdir(OUTPUT_DIR, function (error) {
            if (error) {
                console.error(error);
            }
            else {
                console.log("Success");
            }
        });
    }
    fs.writeFile(outputPath, renderedHtml, function (error) {
        if (error) {
            console.error(error);
        }
        else {
            console.log("Success");
        }
    });
}

const userInstruction = () => {
    console.log("Team Generator");
    console.log("User instruction:");
    console.log("Follow the prompt to input informations");
    console.log("'Ctrl+c' to exit program")
}

const ini = () => {
    console.clear();
    userInstruction();
    setEmployee();
}

ini();
// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
