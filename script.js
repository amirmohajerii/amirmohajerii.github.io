const data = {
  en: {
    name: "Your Name",
    title: "Backend Developer • C# • ASP.NET",
    intro: "Software developer specialized in building secure, scalable, high-performance backend systems using modern .NET technologies.",
    aboutTitle: "About Me",
    aboutText: "I am a backend-focused developer passionate about clean architecture, performance optimization, and security.",
    skillsTitle: "Skills",
    skills: ["C#", ".NET", "ASP.NET Web API", "SQL Server", "MongoDB", "Docker", "Linux", "REST APIs", "JWT", "Clean Architecture"],
    projectsTitle: "Projects",
    p1Title: "Iranian Tax System Integration",
    p1Text: "Full backend integration with Iranian tax APIs, encryption, authentication and performance optimizations.",
    p2Title: "Secure Authentication API",
    p2Text: "JWT authentication system with refresh tokens, RBAC, logging and monitoring.",
    expTitle: "Experience",
    expRole: "Backend Developer",
    expTime: "2023 – Present",
    expText: "Developing scalable APIs, microservices and secure authentication systems.",
    contactTitle: "Contact",
    contactText: "Email: you@email.com | GitHub: github.com/yourusername | LinkedIn: linkedin.com/in/yourusername",
    footerText: "© 2026 Your Name"
  },

  fa: {
    name: "نام شما",
    title: "توسعه‌دهنده بک‌اند • C# • ASP.NET",
    intro: "توسعه‌دهنده نرم‌افزار با تمرکز بر طراحی سیستم‌های امن، مقیاس‌پذیر و با کارایی بالا با استفاده از تکنولوژی‌های مدرن دات‌نت.",
    aboutTitle: "درباره من",
    aboutText: "توسعه‌دهنده بک‌اند علاقه‌مند به معماری تمیز، بهینه‌سازی عملکرد و امنیت سیستم‌ها.",
    skillsTitle: "مهارت‌ها",
    skills: ["C#", ".NET", "ASP.NET Web API", "SQL Server", "MongoDB", "Docker", "Linux", "REST APIs", "JWT", "Clean Architecture"],
    projectsTitle: "پروژه‌ها",
    p1Title: "یکپارچه‌سازی سامانه مودیان",
    p1Text: "پیاده‌سازی کامل ارتباط بک‌اند با سامانه مودیان شامل رمزنگاری، احراز هویت و بهینه‌سازی عملکرد.",
    p2Title: "سیستم احراز هویت امن",
    p2Text: "سیستم احراز هویت مبتنی بر JWT با رفرش توکن، سطح دسترسی و لاگینگ.",
    expTitle: "سوابق کاری",
    expRole: "توسعه‌دهنده بک‌اند",
    expTime: "۱۴۰۲ – تاکنون",
    expText: "توسعه APIهای مقیاس‌پذیر و سیستم‌های احراز هویت امن.",
    contactTitle: "تماس",
    contactText: "ایمیل: you@email.com | گیت‌هاب: github.com/yourusername | لینکدین: linkedin.com/in/yourusername",
    footerText: "© ۱۴۰۴ نام شما"
  }
};

let lang = localStorage.getItem("lang") || "en";

function setLang(l) {
  lang = l;
  localStorage.setItem("lang", l);

  const d = data[l];

  Object.keys(d).forEach(k => {
    if (Array.isArray(d[k])) {
      document.getElementById(k).innerHTML = d[k].map(x => `<span>${x}</span>`).join("");
    } else {
      document.getElementById(k).innerText = d[k];
    }
  });

  document.documentElement.dir = l === "fa" ? "rtl" : "ltr";
  document.getElementById("langToggle").innerText = l === "fa" ? "EN" : "FA";
}

document.getElementById("langToggle").onclick = () => {
  setLang(lang === "en" ? "fa" : "en");
};

setLang(lang);
