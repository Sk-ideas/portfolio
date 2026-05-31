/**
* Template Name: iPortfolio
* Updated: Jan 29 2024 with Bootstrap v5.3.2
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

  /**
   * Share Portfolio Functionality
   */
  let shareBtn = select('#shareButton');
  if (shareBtn) {
    on('click', '#shareButton', async function(e) {
      e.preventDefault();
      if (navigator.share) {
        try {
          await navigator.share({
            title: document.title,
            text: 'Check out the portfolio of Sasi kumar S, Backend Laravel Engineer.',
            url: window.location.href
          });
        } catch (err) {
          console.error('Error sharing:', err);
        }
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href).then(() => {
          let originalHTML = this.innerHTML;
          this.innerHTML = '<i class="bx bx-check me-2" style="font-size: 1.2em;"></i> Copied Link!';
          setTimeout(() => { this.innerHTML = originalHTML; }, 2000);
        });
      }
    });
  }

  /**
   * Toast notification helper
   */
  function showToast(msg, isSuccess) {
    let toast = select('#successToast');
    if (!toast) return;

    let inner = toast.querySelector('div');
    if (isSuccess) {
      inner.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
      inner.innerHTML = '<i class="bi bi-check-circle-fill" style="font-size:1.4rem;"></i><span>' + msg + '</span>';
    } else {
      inner.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
      inner.innerHTML = '<i class="bi bi-x-circle-fill" style="font-size:1.4rem;"></i><span>' + msg + '</span>';
    }

    toast.style.display = 'block';
    inner.style.animation = 'slideIn 0.4s ease';

    setTimeout(() => {
      inner.style.animation = 'slideOut 0.4s ease forwards';
      setTimeout(() => { toast.style.display = 'none'; }, 400);
    }, 4000);
  }

  /**
   * Visitor Notification — fires once per session, emails you details about who visited
   */
  function w3fSend(payload) {
    return fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(Object.assign({ access_key: 'd72f45af-bcf2-44a6-a0e6-31af68906043' }, payload))
    }).catch(() => {});
  }

  async function notifyVisit() {
    if (sessionStorage.getItem('visit_notified')) return;
    sessionStorage.setItem('visit_notified', '1');

    const visitCount = (parseInt(localStorage.getItem('sk_visit_count') || '0')) + 1;
    localStorage.setItem('sk_visit_count', visitCount);

    const ua = navigator.userAgent;

    let browser = 'Unknown';
    if (/Edg\//.test(ua))            browser = 'Edge';
    else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';
    else if (/Firefox\//.test(ua))   browser = 'Firefox';
    else if (/Chrome\//.test(ua))    browser = 'Chrome';
    else if (/Safari\//.test(ua))    browser = 'Safari';

    let device = 'Desktop';
    if (/iPad/.test(ua))                     device = 'Tablet (iPad)';
    else if (/Mobi|Android|iPhone/.test(ua)) device = 'Mobile';

    let os = 'Unknown';
    if (/Windows NT 10/.test(ua))    os = 'Windows 10/11';
    else if (/Windows/.test(ua))     os = 'Windows';
    else if (/Android/.test(ua))     os = 'Android';
    else if (/iPhone|iPad/.test(ua)) os = 'iOS';
    else if (/Mac/.test(ua))         os = 'macOS';
    else if (/Linux/.test(ua))       os = 'Linux';

    const referrer    = document.referrer || 'Direct visit (no referrer)';
    const visitTime   = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
    const language    = navigator.language || 'Unknown';
    const screenRes   = screen.width + 'x' + screen.height;
    const viewport    = window.innerWidth + 'x' + window.innerHeight;
    const timezone    = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
    const cpuCores    = navigator.hardwareConcurrency || 'Unknown';
    const ramGB       = navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'Unknown';
    const touchScreen = ('ontouchstart' in window) ? 'Yes' : 'No';
    const connection  = navigator.connection || {};
    const netType     = connection.effectiveType || 'Unknown';
    const netSpeed    = connection.downlink ? connection.downlink + ' Mbps' : 'Unknown';

    let geo = {};
    try {
      geo = await fetch('https://ipapi.co/json/').then(r => r.json());
    } catch (_) {}

    const city     = geo.city         || 'Unknown';
    const country  = geo.country_name || 'Unknown';
    const lat      = geo.latitude;
    const lng      = geo.longitude;
    const mapsLink = (lat && lng)
      ? 'https://www.google.com/maps?q=' + lat + ',' + lng
      : 'Unavailable';

    const isReturning  = visitCount > 1;
    const lastVisitRaw = localStorage.getItem('sk_last_visit');
    const lastVisit    = lastVisitRaw || 'First visit';
    localStorage.setItem('sk_last_visit', visitTime);

    let battery = 'Not supported';
    try {
      if (navigator.getBattery) {
        const b = await navigator.getBattery();
        battery = Math.round(b.level * 100) + '% (' + (b.charging ? 'Charging' : 'Not charging') + ')';
      }
    } catch (_) {}

    w3fSend({
      subject:   '👤 Portfolio Visit #' + visitCount + ' — ' + city + ', ' + country,
      from_name: 'Portfolio Visitor Tracker',
      message:
        '🌐 VISIT DETAILS\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        'Visit No:      #' + visitCount + '\n' +
        'Visitor:       ' + (isReturning ? 'Returning (visit #' + visitCount + ')' : 'New visitor') + '\n' +
        'Time (IST):    ' + visitTime + '\n' +
        'Last Visit:    ' + lastVisit + '\n' +
        'Referrer:      ' + referrer + '\n\n' +

        '📍 LOCATION\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        'IP:            ' + (geo.ip       || 'Unknown') + '\n' +
        'City:          ' + city + '\n' +
        'Region:        ' + (geo.region   || 'Unknown') + '\n' +
        'Country:       ' + country + '\n' +
        'Postal:        ' + (geo.postal   || 'Unknown') + '\n' +
        'Timezone:      ' + (geo.timezone || timezone)  + '\n' +
        'ISP/Org:       ' + (geo.org      || 'Unknown') + '\n' +
        'Maps:          ' + mapsLink + '\n\n' +

        '💻 DEVICE & BROWSER\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        'Device:        ' + device + '\n' +
        'OS:            ' + os + '\n' +
        'Browser:       ' + browser + '\n' +
        'Language:      ' + language + '\n' +
        'Screen:        ' + screenRes + '\n' +
        'Viewport:      ' + viewport + '\n' +
        'Touch Screen:  ' + touchScreen + '\n' +
        'Battery:       ' + battery + '\n\n' +

        '⚙️ HARDWARE\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        'CPU Cores:     ' + cpuCores + '\n' +
        'RAM:           ' + ramGB + '\n\n' +

        '📶 NETWORK\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        'Connection:    ' + netType + '\n' +
        'Speed:         ' + netSpeed
    });
  }

  window.addEventListener('load', notifyVisit);

  /**
   * Resume download / view tracker
   */
  document.querySelectorAll('a[href="Sasi_kumar_S.pdf"]').forEach(function(link) {
    link.addEventListener('click', function() {
      const action    = this.hasAttribute('download') ? 'Downloaded' : 'Viewed';
      const visitTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
      w3fSend({
        subject:   '📄 Resume ' + action + ' — ' + visitTime,
        from_name: 'Portfolio Resume Tracker',
        message:
          'Someone ' + action.toLowerCase() + ' your resume!\n\n' +
          'Action:   ' + action + '\n' +
          'Time:     ' + visitTime + '\n' +
          'Page URL: ' + window.location.href + '\n' +
          'Referrer: ' + (document.referrer || 'Direct')
      });
    });
  });

  /**
   * Engagement Tracker — sections, link clicks, time on page
   */
  (function() {
    const pageStart = Date.now();
    const sectionTime = {};
    const sectionActive = {};
    const clickedLinks = [];

    const sectionLabels = {
      hero:       'Home / Hero',
      about:      'About',
      skills:     'Skills',
      experience: 'Experience',
      projects:   'Projects',
      resume:     'Resume / Education',
      contact:    'Contact'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          sectionActive[id] = Date.now();
        } else if (sectionActive[id]) {
          sectionTime[id] = (sectionTime[id] || 0) + (Date.now() - sectionActive[id]);
          delete sectionActive[id];
        }
      });
    }, { threshold: 0.3 });

    Object.keys(sectionLabels).forEach(function(id) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    [
      { sel: 'a[href*="mailto"]',   label: 'Email icon' },
      { sel: 'a[href*="linkedin"]', label: 'LinkedIn' },
      { sel: 'a[href*="github"]',   label: 'GitHub' },
      { sel: '#shareButton',        label: 'Share button' }
    ].forEach(function(item) {
      document.querySelectorAll(item.sel).forEach(function(el) {
        el.addEventListener('click', function() {
          const t = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
          clickedLinks.push(item.label + ' at ' + t);
        });
      });
    });

    function fmtSeconds(ms) {
      const s = Math.round(ms / 1000);
      return s >= 60 ? Math.floor(s / 60) + 'm ' + (s % 60) + 's' : s + 's';
    }

    window.addEventListener('pagehide', function() {
      Object.keys(sectionActive).forEach(function(id) {
        sectionTime[id] = (sectionTime[id] || 0) + (Date.now() - sectionActive[id]);
      });

      const total   = Date.now() - pageStart;
      const totalMs = fmtSeconds(total);
      const leftAt  = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });

      const sectionLines = Object.entries(sectionTime)
        .sort(function(a, b) { return b[1] - a[1]; })
        .map(function(e) {
          return (sectionLabels[e[0]] || e[0]) + ': ' + fmtSeconds(e[1]);
        }).join('\n') || 'None recorded';

      fetch('https://api.web3forms.com/submit', {
        method:   'POST',
        keepalive: true,
        headers:  { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: 'd72f45af-bcf2-44a6-a0e6-31af68906043',
          subject:    '📊 Session Summary — ' + totalMs + ' on page',
          from_name:  'Portfolio Session Tracker',
          message:
            '⏱️ SESSION SUMMARY\n' +
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
            'Left at:       ' + leftAt  + '\n' +
            'Time on page:  ' + totalMs + '\n\n' +

            '📌 TIME PER SECTION\n' +
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
            sectionLines + '\n\n' +

            '🔗 LINKS CLICKED\n' +
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
            (clickedLinks.length ? clickedLinks.join('\n') : 'None')
        })
      });
    });
  })();

  /**
   * Contact Form - Web3Forms Handler
   */
  let contactForm = select('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      let name    = select('#cf-name').value.trim();
      let email   = select('#cf-email').value.trim();
      let subject = select('#cf-subject').value.trim();
      let message = select('#cf-message').value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill in all fields.', false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.', false);
        return;
      }

      let submitBtn   = select('#cf-submit');
      let originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Sending...';
      submitBtn.disabled  = true;

      try {
        const res  = await fetch('https://api.web3forms.com/submit', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: 'd72f45af-bcf2-44a6-a0e6-31af68906043',
            subject:    subject + ' (from ' + name + ')',
            from_name:  name,
            replyto:    email,
            message:    'From: ' + name + '\nEmail: ' + email + '\n\n' + message
          })
        });

        const data = await res.json();

        if (data.success) {
          showToast('Message sent successfully! I\'ll get back to you soon.', true);
          contactForm.reset();
        } else {
          showToast('Failed to send message. Please try again.', false);
        }
      } catch (error) {
        showToast('Network error. Please check your internet connection.', false);
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled  = false;
      }
    });
  }

})();