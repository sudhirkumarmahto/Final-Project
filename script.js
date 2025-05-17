document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const resumeForm = document.getElementById('resumeForm');
    const addEducationBtn = document.getElementById('addEducation');
    const addExperienceBtn = document.getElementById('addExperience');
    const educationEntries = document.getElementById('educationEntries');
    const experienceEntries = document.getElementById('experienceEntries');
    const downloadPdfBtn = document.getElementById('downloadPdf');
    const resumePreview = document.getElementById('resumePreview');
    const resumeTemplate = document.getElementById('resumeTemplate');

    // Add event listeners
    addEducationBtn.addEventListener('click', addEducationEntry);
    addExperienceBtn.addEventListener('click', addExperienceEntry);
    resumeForm.addEventListener('submit', generateResume);
    downloadPdfBtn.addEventListener('click', downloadAsPdf);

    // Initially hide the preview and download button
    resumePreview.style.display = 'none';

    // Animation for added entries
    function animateEntry(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 10);
    }

    // Function to add a new education entry
    function addEducationEntry() {
        const educationEntry = document.createElement('div');
        educationEntry.className = 'education-entry';
        
        educationEntry.innerHTML = `
            <div class="form-group">
                <label for="institution"><i class="fas fa-university"></i> Institution</label>
                <input type="text" class="institution" name="institution" placeholder="University Name">
            </div>
            <div class="form-group">
                <label for="degree"><i class="fas fa-scroll"></i> Degree</label>
                <input type="text" class="degree" name="degree" placeholder="Bachelor of Science">
            </div>
            <div class="form-group">
                <label for="eduStartDate"><i class="fas fa-calendar-alt"></i> Start Date</label>
                <input type="month" class="eduStartDate" name="eduStartDate">
            </div>
            <div class="form-group">
                <label for="eduEndDate"><i class="fas fa-calendar-check"></i> End Date</label>
                <input type="month" class="eduEndDate" name="eduEndDate">
            </div>
            <button type="button" class="btn-remove" title="Remove entry" onclick="this.parentNode.remove()"><i class="fas fa-times"></i></button>
        `;
        
        educationEntries.appendChild(educationEntry);
        animateEntry(educationEntry);

        // Scroll to the new entry
        educationEntry.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Focus on the first input of the new entry
        setTimeout(() => {
            educationEntry.querySelector('input').focus();
        }, 500);
    }

    // Function to add a new experience entry
    function addExperienceEntry() {
        const experienceEntry = document.createElement('div');
        experienceEntry.className = 'experience-entry';
        
        experienceEntry.innerHTML = `
            <div class="form-group">
                <label for="company"><i class="fas fa-building"></i> Company</label>
                <input type="text" class="company" name="company" placeholder="Company Name">
            </div>
            <div class="form-group">
                <label for="position"><i class="fas fa-id-badge"></i> Position</label>
                <input type="text" class="position" name="position" placeholder="Job Title">
            </div>
            <div class="form-group">
                <label for="expStartDate"><i class="fas fa-calendar-alt"></i> Start Date</label>
                <input type="month" class="expStartDate" name="expStartDate">
            </div>
            <div class="form-group">
                <label for="expEndDate"><i class="fas fa-calendar-check"></i> End Date</label>
                <input type="month" class="expEndDate" name="expEndDate">
            </div>
            <div class="form-group">
                <label for="responsibilities"><i class="fas fa-tasks"></i> Responsibilities</label>
                <textarea class="responsibilities" name="responsibilities" rows="3" placeholder="Describe your main responsibilities and achievements"></textarea>
            </div>
            <button type="button" class="btn-remove" title="Remove entry" onclick="this.parentNode.remove()"><i class="fas fa-times"></i></button>
        `;
        
        experienceEntries.appendChild(experienceEntry);
        animateEntry(experienceEntry);

        // Scroll to the new entry
        experienceEntry.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Focus on the first input of the new entry
        setTimeout(() => {
            experienceEntry.querySelector('input').focus();
        }, 500);
    }

    // Function to generate the resume
    function generateResume(event) {
        event.preventDefault();
        
        // Show loading indicator
        resumePreview.style.display = 'block';
        resumeTemplate.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Generating your resume...</div>';
        
        // Get form values
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const summary = document.getElementById('summary').value;
        const skills = document.getElementById('skills').value;

        // Get education entries
        const educationItems = [];
        const eduEntries = document.querySelectorAll('.education-entry');
        
        eduEntries.forEach(entry => {
            const institution = entry.querySelector('.institution').value;
            const degree = entry.querySelector('.degree').value;
            const startDate = entry.querySelector('.eduStartDate').value;
            const endDate = entry.querySelector('.eduEndDate').value;
            
            if (institution || degree) {
                educationItems.push({
                    institution,
                    degree,
                    startDate: formatDate(startDate),
                    endDate: formatDate(endDate)
                });
            }
        });

        // Get experience entries
        const experienceItems = [];
        const expEntries = document.querySelectorAll('.experience-entry');
        
        expEntries.forEach(entry => {
            const company = entry.querySelector('.company').value;
            const position = entry.querySelector('.position').value;
            const startDate = entry.querySelector('.expStartDate').value;
            const endDate = entry.querySelector('.expEndDate').value;
            const responsibilities = entry.querySelector('.responsibilities').value;
            
            if (company || position) {
                experienceItems.push({
                    company,
                    position,
                    startDate: formatDate(startDate),
                    endDate: formatDate(endDate),
                    responsibilities
                });
            }
        });

        // Format skills as an array
        const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill !== '');

        // Simulate loading delay for better UX
        setTimeout(() => {
            // Generate and show the resume
            generateResumeTemplate(
                fullName, 
                email, 
                phone, 
                address, 
                summary, 
                educationItems, 
                experienceItems, 
                skillsArray
            );
            
            // Scroll to the preview
            resumePreview.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 800);
    }

    // Function to format date from month input (YYYY-MM) to readable format
    function formatDate(dateString) {
        if (!dateString) return 'Present';
        
        const date = new Date(dateString);
        return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    }

    // Function to format bullet points for responsibilities
    function formatBulletPoints(text) {
        if (!text) return '';
        
        // Split by new lines or semicolons
        const points = text.split(/[\n;]+/).filter(point => point.trim() !== '');
        
        if (points.length <= 1) return text;
        
        return `<ul>${points.map(point => `<li>${point.trim()}</li>`).join('')}</ul>`;
    }

    // Function to generate the resume template
    function generateResumeTemplate(name, email, phone, address, summary, education, experience, skills) {
        let educationHTML = '';
        education.forEach(edu => {
            educationHTML += `
                <div class="edu-item">
                    <h4>${edu.institution}</h4>
                    <div>${edu.degree}</div>
                    <div class="edu-date">${edu.startDate} - ${edu.endDate}</div>
                </div>
            `;
        });

        let experienceHTML = '';
        experience.forEach(exp => {
            experienceHTML += `
                <div class="exp-item">
                    <h4>${exp.position}</h4>
                    <div>${exp.company}</div>
                    <div class="exp-date">${exp.startDate} - ${exp.endDate}</div>
                    <div class="exp-responsibilities">${formatBulletPoints(exp.responsibilities)}</div>
                </div>
            `;
        });

        let skillsHTML = '';
        skills.forEach(skill => {
            skillsHTML += `<span class="skill-item">${skill}</span>`;
        });

        const template = `
            <div class="resume-header">
                <h2>${name}</h2>
                <div class="resume-contact">
                    ${email ? `<span><i class="fas fa-envelope"></i> ${email}</span>` : ''}
                    ${phone ? `<span><i class="fas fa-phone"></i> ${phone}</span>` : ''}
                    ${address ? `<span><i class="fas fa-map-marker-alt"></i> ${address}</span>` : ''}
                </div>
            </div>
            
            ${summary ? `
            <div class="resume-summary">
                <h3>Professional Summary</h3>
                <p>${summary}</p>
            </div>
            ` : ''}
            
            ${experience.length > 0 ? `
            <div class="resume-section">
                <h3>Work Experience</h3>
                <div class="resume-experience">
                    ${experienceHTML}
                </div>
            </div>
            ` : ''}
            
            ${education.length > 0 ? `
            <div class="resume-section">
                <h3>Education</h3>
                <div class="resume-education">
                    ${educationHTML}
                </div>
            </div>
            ` : ''}
            
            ${skills.length > 0 ? `
            <div class="resume-section">
                <h3>Skills</h3>
                <div class="skills-list">
                    ${skillsHTML}
                </div>
            </div>
            ` : ''}
        `;

        // Add fade-in animation to the resume template
        resumeTemplate.style.opacity = '0';
        resumeTemplate.innerHTML = template;
        
        setTimeout(() => {
            resumeTemplate.style.transition = 'opacity 0.5s ease';
            resumeTemplate.style.opacity = '1';
        }, 50);
    }

    // Function to download the resume as PDF
    function downloadAsPdf() {
        // Show download indicator
        const downloadBtn = document.getElementById('downloadPdf');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing PDF...';
        downloadBtn.disabled = true;
        
        // Configure pdf options
        const element = document.getElementById('resumeTemplate');
        const options = {
            margin: [15, 15],
            filename: 'resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Generate the PDF with a slight delay for better UX
        setTimeout(() => {
            html2pdf().from(element).set(options).save()
                .then(() => {
                    // Reset button after PDF generation
                    setTimeout(() => {
                        downloadBtn.innerHTML = originalText;
                        downloadBtn.disabled = false;
                    }, 1500);
                });
        }, 500);
    }
}); 