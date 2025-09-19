// Interactive Buttons
function enroll() {
    alert("🚀 Thank you! Enrollment for Quantam Quirks will open soon.");
  }
  function knowMore() {
    alert("💡 Quantam Quirks is a futuristic event of innovation and creativity.");
  }
  
  // GSAP Animations
  gsap.from(".navbar", { y: -100, opacity: 0, duration: 1 });
  gsap.from(".hero h2", { opacity: 0, y: 50, duration: 1, delay: 0.5 });
  gsap.from(".hero p", { opacity: 0, y: 50, duration: 1, delay: 1 });
  gsap.from(".cta-btn", { opacity: 0, scale: 0.5, duration: 1, delay: 1.5 });
  
  gsap.utils.toArray("section").forEach(sec => {
    gsap.from(sec.children, {
      opacity: 0, y: 50, duration: 1, stagger: 0.2,
      scrollTrigger: { trigger: sec, start: "top 80%" }
    });
  });
  
  // Animated background particles in Hero
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  
  let particles = [];
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.speedY = (Math.random() - 0.5) * 1.5;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if(this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if(this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.fillStyle = "#00e0ff";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      ctx.fill();
    }
  }
  
  function initParticles() {
    particles = [];
    for(let i=0;i<100;i++) particles.push(new Particle());
  }
  function animateParticles() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  
  initParticles();
  animateParticles();
  window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    initParticles();
  });
  function viewEnroll() {
    window.location.href = "enroll/view.html";
  }
  function login() {
    window.location.href = "login/login.html";
  }
  // Close hamburger menu when clicking outside
  // Toggle menu on hamburger click
function toggleMenu(event) {
  event.stopPropagation(); // Prevent immediate closing
  document.querySelector(".nav-links").classList.toggle("active");
  document.querySelector(".nav-buttons").classList.toggle("active");
}

// Close menu when clicking outside
document.addEventListener("click", function (event) {
  const navLinks = document.querySelector(".nav-links");
  const navButtons = document.querySelector(".nav-buttons");
  const hamburger = document.querySelector(".hamburger");

  // If menu is open and click is outside of menu + hamburger
  if (
    (navLinks.classList.contains("active") || navButtons.classList.contains("active")) &&
    !navLinks.contains(event.target) &&
    !navButtons.contains(event.target) &&
    !hamburger.contains(event.target)
  ) {
    navLinks.classList.remove("active");
    navButtons.classList.remove("active");
  }
});

// ✅ Also close menu when clicking a nav link (good for mobile UX)
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.remove("active");
    document.querySelector(".nav-buttons").classList.remove("active");
  });
});
// Handle Contact Form Submission
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("⚠️ Please fill in all fields!");
    return;
  }

  try {
    const res = await fetch("https://backend-f64w.onrender.com/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    const data = await res.json();

    if (data.ok) {
      alert("✅ Thank you! Your message has been sent.");
      document.getElementById("contactForm").reset();
    } else {
      alert("❌ " + (data.error || "Failed to send message"));
    }
  } catch (err) {
    console.error(err);
    alert("❌ Server error. Please try again later.");
  }
});
