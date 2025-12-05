from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os
import random

# --- 1. SETUP ---
def create_pdf(filename, text_content):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    y = height - 50
    
    # Title
    clean_title = filename.split("/")[-1].replace('.pdf', '').replace('_', ' ')
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, f"CONFIDENTIAL: {clean_title}")
    y -= 40
    
    # Body
    c.setFont("Helvetica", 10)
    for line in text_content.split('\n'):
        if y < 50:
            c.showPage()
            y = height - 50
            c.setFont("Helvetica", 10)
        c.drawString(50, y, line)
        y -= 15
    c.save()
    print(f"Generated: {filename}")

# --- 2. DATA POOLS ---
clients = ["Apex Corp", "Zenith Bank", "Omicron Logistics", "Delta Health", "Nova Energy", 
           "Cyber Systems", "Global Freight", "Urban Retail", "Rapid Finance", "Blue Sky Aviation"]
tech_stacks = ["Python/Django", "React/Node.js", "Java Spring Boot", "AWS Lambda", "Azure DevOps", 
               "Google Cloud AI", "Kubernetes", "Docker Swarm", "PostgreSQL", "MongoDB"]
outcomes = ["Reduced latency by 40%", "Saved $2M annually", "Automated 90% of workflow", 
            "Improved uptime to 99.99%", "Cut server costs by 50%"]
locations = ["Dubai", "London", "New York", "Singapore", "Karachi", "Berlin", "Toronto"]
names = ["Ali Khan", "Sarah Jenkins", "David Chen", "Fatima Ahmed", "John Smith", 
         "Maria Garcia", "Wei Zhang", "Omar Farooq", "Emily Davis", "Rahul Gupta"]
roles = ["Senior Architect", "DevOps Engineer", "Data Scientist", "Project Manager", "Security Specialist"]

# --- 3. GENERATORS ---

def generate_case_studies(count=20):
    for i in range(count):
        client = random.choice(clients)
        tech = random.choice(tech_stacks)
        outcome = random.choice(outcomes)
        loc = random.choice(locations)
        
        text = f"""
        PROJECT CASE STUDY: {client}
        --------------------------------
        Client Industry: Enterprise Level
        Location: {loc}
        
        Challenge:
        The client faced significant scalability issues with their legacy infrastructure.
        Data processing was taking 48+ hours, leading to business delays.
        
        Solution Delivered by NexusTech:
        We implemented a microservices architecture using {tech}.
        The system was deployed across three availability zones for maximum redundancy.
        
        Key Results:
        - {outcome}
        - Integrated fully with existing legacy systems within 3 months.
        - Security audit passed with 0 critical vulnerabilities.
        
        Technical Contact: {random.choice(names)}
        """
        create_pdf(f"knowledge_base/Case_Study_{client}_{i}.pdf", text)

def generate_resumes(count=15):
    for i in range(count):
        name = random.choice(names)
        role = random.choice(roles)
        tech = random.choice(tech_stacks)
        
        text = f"""
        EMPLOYEE PROFILE: {name}
        --------------------------------
        Current Role: {role}
        Years at NexusTech: {random.randint(1, 10)} years
        
        Certifications:
        - Certified {tech} Professional
        - AWS Solutions Architect Associate
        - Scrum Master Certified
        
        Project History:
        - Lead Engineer for the {random.choice(clients)} migration project.
        - Developed the core API for our internal automation tool.
        
        Clearance Level: Level {random.randint(1,3)} Security Clearance
        """
        create_pdf(f"knowledge_base/Profile_{name.replace(' ', '_')}_{i}.pdf", text)

def generate_compliance_docs(count=10):
    topics = ["Data Retention", "Remote Access", "Password Policy", "Vendor Management", "Incident Response"]
    for i in range(count):
        topic = random.choice(topics)
        text = f"""
        INTERNAL POLICY #{random.randint(1000, 9999)}: {topic}
        --------------------------------
        Effective Date: 2024-01-01
        
        1. Purpose
        To establish strict guidelines regarding {topic} to ensure ISO 27001 compliance.
        
        2. Scope
        This policy applies to all full-time employees and contractors.
        
        3. Policy Details
        - All systems must adhere to strict logging protocols.
        - Violations of this policy will result in immediate disciplinary action.
        - Audits occur quarterly.
        
        Approved By: Chief Information Security Officer (CISO)
        """
        create_pdf(f"knowledge_base/Policy_{topic.replace(' ', '_')}_{i}.pdf", text)

def generate_technical_specs(count=10):
    for i in range(count):
        tech = random.choice(tech_stacks)
        text = f"""
        TECHNICAL SPECIFICATION: {tech} Standard
        --------------------------------
        Version: {random.randint(1,5)}.0
        
        Overview:
        This document outlines the standard configuration for using {tech} 
        within the NexusTech ecosystem.
        
        Configuration:
        - Memory Limit: 512MB minimum
        - Timeout: 30 seconds
        - Logging: JSON format required
        
        Deployment Strategy:
        Blue/Green deployment is mandatory for all production services utilizing this stack.
        """
        create_pdf(f"knowledge_base/Tech_Spec_{tech.split('/')[0]}_{i}.pdf", text)

# --- 4. EXECUTION ---
if __name__ == "__main__":
    print("Starting Big Data Generation...")
    
    # 1. Generate the Core Static Files (The most important ones)
    security_text = """
    1. Information Security Policy
    NexusTech Solutions is ISO 27001 certified. All customer data is encrypted 
    at rest using AES-256 standards and in transit using TLS 1.3.
    """
    create_pdf("knowledge_base/00_MASTER_SECURITY.pdf", security_text)

    pricing_text = """
    Standard Rate Card (2025)
    - Enterprise Tier: $5,000 / month (Unlimited users)
    - Senior Solution Architect: $250 / hour
    """
    create_pdf("knowledge_base/00_MASTER_PRICING.pdf", pricing_text)

    # 2. Generate the Volume (55 files total)
    generate_case_studies(20)
    generate_resumes(15)
    generate_compliance_docs(10)
    generate_technical_specs(10)
    
    print("\nSUCCESS! Generated 55+ Documents in 'knowledge_base' folder.")