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

//inquirer questions with input validation
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


//fuction to generate objects depends on user's input, then save those objects in an array.
const setEmployee = () => {
    inquirer
        .prompt(questions)
        .then(response => {
            // console.log(response);
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
            //add another employee
            if (response.add) {
                console.log("========================================");
                setEmployee();
            }
            //after finish input all employee informations, call wtiteTeam function
            else {
                writeTeam();
            }
            // console.log(employees);
        })
}

//funtion to generate team.html page
const writeTeam = () => {
    let renderedHtml = render(employees);
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdir(OUTPUT_DIR, function (error) {
            if (error) {
                console.error(error);
            }
            else {
                console.log("'output folser has been generated!!'");
            }
        });
    }
    fs.writeFile(outputPath, renderedHtml, function (error) {
        if (error) {
            console.error(error);
        }
        else {
            console.log("----------------------------------------");
            console.log("Team page has been generated!!");
        }
    });
}

//console log instruction.
const userInstruction = () => {
    console.log("Team Generator");
    console.log("----------------------------------------")
    console.log("User instruction:");
    console.log("Follow the prompt to input your employees' informations.");
    console.log("Will generate a 'team.html' file under 'output' folder.");
    console.log("'Ctrl+c' to end the program!");
    console.log("----------------------------------------");

}

//start app function
const ini = () => {
    console.clear();
    userInstruction();
    setEmployee();
}

ini();
