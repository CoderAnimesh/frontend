document.addEventListener("DOMContentLoaded", () => {
  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const otpGroup = document.getElementById("otpGroup");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");
  const loader = document.getElementById("loader");
  const enrollBtn = document.getElementById("enrollBtn");

  let otpVerified = false;
  const eventId = localStorage.getItem("selectedEventId");
  if (!eventId) return alert("⚠️ Event ID not found!");

  function showLoader() { loader.style.display = "flex"; }
  function hideLoader() { loader.style.display = "none"; }

  // -------------------- Send OTP --------------------
  sendOtpBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const name = document.getElementById("name").value.trim();
    if (!email) return alert("⚠️ Please enter your email!");

    try {
      showLoader();

      // step 1: check email
      const checkRes = await fetch("http://localhost:5000/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, eventId })
      });
      const checkData = await checkRes.json();
      if (!checkData.ok) {
        hideLoader();
        return alert("❌ " + checkData.message);
      }

      // step 2: send OTP only if check passed
      const otpRes = await fetch(`http://localhost:5000/api/otp/${eventId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name })
      });
      const otpData = await otpRes.json();

      hideLoader(); // ✅ hide loader only after both steps finish

      if (otpRes.ok && otpData.ok) {
        otpGroup.style.display = "block";
        alert("📧 OTP sent to your email!");
      } else {
        alert(otpData.message || "❌ Failed to send OTP");
      }

    } catch (err) {
      hideLoader();
      console.error(err);
      alert("🚨 Error sending OTP: " + err.message);
    }
  });

  // -------------------- Verify OTP --------------------
  verifyOtpBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const otp = document.getElementById("otp").value.trim();
    if (!otp) return alert("⚠️ Please enter OTP!");

    try {
      showLoader();
      const res = await fetch(`http://localhost:5000/api/otp/${eventId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      hideLoader();

      if (res.ok && data.ok) {
        otpVerified = true;
        alert("✅ OTP Verified!");
        otpGroup.style.display = "none";
        enrollBtn.disabled = false;
        enrollBtn.textContent = "Enroll Now";
      } else {
        alert(data.message || "❌ OTP verification failed");
      }
    } catch (err) {
      hideLoader();
      console.error("Verify OTP error:", err);
      alert("🚨 Error verifying OTP: " + err.message);
    }
  });

  // -------------------- Enroll directly --------------------
  enrollBtn.addEventListener("click", async () => {
    if (!otpVerified) return alert("⚠️ Verify OTP first!");

    const formData = {
      name: document.getElementById("name").value.trim(),
      batch: document.getElementById("batch").value,
      semester: document.getElementById("semester").value,
      fatherName: document.getElementById("father").value.trim(),
      motherName: document.getElementById("mother").value.trim(),
      gender: document.getElementById("gender").value,
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      preferredLanguage: document.getElementById("language").value,
      eventId: Number(eventId)
    };

    try {
      showLoader();
      const res = await fetch("http://localhost:5000/api/participants/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      hideLoader();

      if (res.ok && data.ok) {
        alert("✅ Enrollment successful!");
        window.location.href = `/successful.html?code=${encodeURIComponent(data.code)}`;
      } else {
        alert("❌ " + (data.message || "Enrollment failed"));
      }
    } catch (err) {
      hideLoader();
      console.error("Enroll error:", err);
      alert("🚨 Enrollment error: " + err.message);
    }
  });
});
