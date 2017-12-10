var data = {
    "bio": {
        "name": "MUHAMMAD ALI MAHMOOD",
        "role": "Front-End Web Developer",
        "bioPic": "images/profilepic.jpg",
        "contacts": {
            "mobile": "+86 158 2188 7020",
            "email": "muhammadalimahmood@yahoo.com",
            "github": "muhammadalimahmood"
        },
        "skills": ["HTML/CSS", "JavaScript", "AJAX", "JSON", "Bootstrap", "HTML Canvas", "git/GitHub", "Grunt/Gulp", "USB Debugging"]
    },
    "education": {
        "university": [
            {
                "name": "Udacity",
                "degree": "Nano-Degree",
                "major": "Front-End Web Development",
                "year": "2017"
            },
            {
                "name": "Shanghai Jiao Tong University, China",
                "city": "Shanghai",
                "degree": "M.Sc",
                "major": "Automation Engineering",
                "year": "2015 - present"
            },
            {
                "name": "GIK Institute of Engineering Sciences & Technology, Pakistan",
                "city": "Topi",
                "degree": "B.Sc",
                "major": "Electronic Engineering",
                "year": "2009 - 2013"
            }
        ]
    },

    "work": {
        "jobs": [
            {
                "employer": "British American Tobacco",
                "title": "Intern",
                "location": "Jhelum, Pakistan",
                "dates": "10th June 2012 – 20th July 2012",
                "description": "Close Loop Control and Steam Recirculation of Tobacco Stem Conditioning Cylinder which includes feed rate control, water control, casing control and steam control & recirculation"
        },
            {
                "employer": "Fauji Fertilizer Company Limited",
                "title": "Intern",
                "location": "Mirpur Mathelo, Pakistan",
                "dates": "21st July 2012 – 20th Aug 2012",
                "description": "Worked in E&I and Utilities department. Studied P&I diagrams, field instrumentation and controls. Studied vibration monitoring equipment. Familiarization with Emergency Shutdown System-Yokogawa Centum CS 3000. Familiarization with Distributed Control System-Honeywell Fail Safe Controller."
        }
        ]
    },

    "projects": {
        "project": [
            {
                "title": "Self Branding",
                "description": "A flexible and professional interactive resume to showcase the projects and skills that I have learnt during Web-Front End Nanodegree",
                "image": "selfBranding",
                "url": "#",
                "skills": ""
            },
            {
                "title": "#perfmatters",
                "description": "Optimized critical rendering path (CRP) by minimizing the critical bytes, render blocking and parser blocking resources. Resulting page renders within a second",
                "image": "webPerf",
                "url": "webPerformanceOptimizations/index.html",
                "skills": ""
            },
            {
                "title": "Responsive Blog",
                "description": "Optimized the website size by reducing image sizes from 3.1MB to 254KB (Viewport < 500px ), 689KB (Viewport < 650px), 376KB (Normal Laptop) and 1.1MB (Ratina Display)",
                "image": "responsiveBlog",
                "url": "responsiveOptimizedImages/index.html",
                "skills": ""
            },
            {
                "title": "The Brighton Times",
                "description": "Designed a website with three major break points using responsive web design patterns like column drop, mostly fluid, layout shifter and off-canvas",
                "image": "responsiveWeb",
                "url": "responsiveWebsite/index.html",
                "skills": ""
            },
            {
                "title": "Frogger",
                "description": "Implemented the game using JS Design Patterns like psuedo-classical Super/SubClasses and Inheritance etc. Game Engine was implemented using HTML canvas",
                "image": "frogger",
                "url": "froggerGame/index.html",
                "skills": ""
            },
            {
                "title": "Exo-Planets",
                "description": "Chained JS Promise's to fetch data about planets in parallel while rendering it serially.",
                "image": "exo",
                "url": "exoPlanets/index.html",
                "skills": ""
            }
        ]
    }
};

var controller = {
    init: function(){
        view.init();
        view.displayEducation();
        view.displayProjects();
    },
    appendResume: function (what, how, where) {
        $(where).append(how.replace("%data%", what));
    },
    getBio: function(){
        return data.bio;
    },
    getEducation: function(){
        return data.education;
    },
    getProjects: function(){
        return data.projects;
    }
};

var view = {
    init: function(){
        var bio = controller.getBio();
        controller.appendResume(bio.bioPic, htmlPic, "#title-logo");
        controller.appendResume(bio.name, htmlHeaderName, "#header-text");
        controller.appendResume(bio.role, htmlRole, "#header-text");

        var listString = '';
        for (var s in bio.skills){
            listString += htmlSkill.replace('%data%', bio.skills[s]);
        }
        controller.appendResume(listString, htmlSkillsList, '#header-text');

        var contactList = htmlMobile.replace("%data%", bio.contacts.mobile) + htmlEmail.replace("%data%", bio.contacts.email) + htmlGitHub.replace("%data%", bio.contacts.github);
        controller.appendResume(contactList, htmlBioList, "#header-list");
    },
    displayEducation: function(){
        var education = controller.getEducation();

        for(var e in education.university){
            $("#education").append(htmlUniName.replace("%data%", education.university[e].name) + htmlDegree.replace("%data%", education.university[e].degree) + htmlMajor.replace("%data%", education.university[e].major));
            controller.appendResume(education.university[e].year, htmlUniDuration, "#education");
        }
    },
    displayProjects: function(){
        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };
        var projects = controller.getProjects();
        for (var p in projects.project){
            var project = htmlProjectImage.replaceAll("%data%", projects.project[p].image) + htmlProjectTitle.replace("%data%", projects.project[p].title) + htmlProjectDescription.replace("%data%", projects.project[p].description) + htmlProjectUrl.replace('%data%', projects.project[p].url);
            controller.appendResume(project, htmlProjectContainer, "#projects");
        }
    }
};

// jQuery runs this function after the DOM is loaded. Same as document.ready()
$(function(){
    controller.init();
});