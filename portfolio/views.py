from django.shortcuts import render

def index(request):
    context = {
        'personal_info': {
            'name': 'Mohanraj M',
            'email': 'mohanrajlenova@gmail.com',
            'phone': '+91 7550208154',
            'location': 'Chennai, India',
            'title': 'Python Developer',
            'bio': 'Experienced Python Developer with a strong background in Django for building scalable web applications. Proficient in RESTful APIs, front-end integration, and cloud deployment. Skilled in data analysis, automation, and database management.',
        },
        'education': [
            {
                'degree': 'MSc IT',
                'institution': 'SRM University',
                'period': 'Pursuing, 2024–2026',
            },
            {
                'degree': 'BSc CS',
                'institution': 'SRM University',
                'period': '2021–2024',
                'gpa': '7.1',
            }
        ],
        'projects': [
            {
                'title': 'Subash Build & Design Studio',
                'date': 'Recent',
                'url': 'https://www.subashbuildanddesignstudio.com/',
                'description': 'A premium interior design and architecture portfolio website. Features a modern UI with high-quality galleries to showcase client projects.',
                'stack': ['Django', 'Python', 'HTML', 'CSS', 'JS'],
            },
            {
                'title': 'MayaAqua',
                'date': 'Freelance Client',
                'url': 'https://mayaaqua.vercel.app/',
                'description': 'Delivered a complete web solution for a freelance client called MayaAqua. Built and deployed a professional responsive website tailored to their brand.',
                'stack': ['Python', 'Django', 'HTML', 'CSS', 'JS'],
            },
            {
                'title': 'WabiClothing',
                'date': 'Jul 2024',
                'url': 'https://wabiclothing.com/',
                'description': 'E-commerce clothing website with admin dashboard, cart/checkout, user auth, mobile-first UI.',
                'stack': ['Python', 'Django', 'MySQL', 'Bootstrap', 'JS'],
            }
        ],
        'internships': [
            {
                'company': 'OurBharatPita',
                'role': 'IT Support Intern',
                'description': 'Technical support, system maintenance, IT operations.',
            },
            {
                'company': 'Spark Inventive',
                'role': 'Game Character Developer Intern',
                'description': 'Designed game characters, collaborated on assets.',
            },
            {
                'company': 'Corpital Web Hosting',
                'role': 'Web Dev/Hosting Intern',
                'description': 'Website hosting, deployment, server management.',
            }
        ],
        'skills': [
            {'name': 'Python', 'level': 90},
            {'name': 'Django', 'level': 85},
            {'name': 'HTML/CSS', 'level': 85},
            {'name': 'JavaScript', 'level': 75},
            {'name': 'Bootstrap', 'level': 80},
            {'name': 'MySQL/SQLite', 'level': 85},
            {'name': 'REST APIs', 'level': 80},
            {'name': 'Git', 'level': 75},
            {'name': 'AJAX', 'level': 70},
        ]
    }
    return render(request, 'portfolio/index.html', context)
