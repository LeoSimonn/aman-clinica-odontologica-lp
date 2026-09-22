/**
 * AMAN CLÍNICA ODONTOLÓGICA - JAVASCRIPT MOBILE-FIRST
 * Menu Drawer, Filtro de Procedimentos por Categoria, Máscara e Integração WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  const CLINIC_WHATSAPP = '5551999208117'; // (51) 99920-8117
  
  // -------------------------------------------------------------
  // 1. Menu Drawer Mobile & Backdrop
  // -------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const navBackdrop = document.getElementById('navBackdrop');
  const navLinks = document.getElementById('navLinks');

  function openDrawer() {
    if (navLinks && navBackdrop) {
      navLinks.classList.add('open');
      navBackdrop.classList.add('open');
      if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Impede rolagem do fundo
    }
  }

  function closeDrawer() {
    if (navLinks && navBackdrop) {
      navLinks.classList.remove('open');
      navBackdrop.classList.remove('open');
      if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (navBackdrop) navBackdrop.addEventListener('click', closeDrawer);

  // Fecha menu ao clicar em qualquer link da navegação
  if (navLinks) {
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });
  }

  // -------------------------------------------------------------
  // 2. Filtro de Procedimentos por Chips (Mobile-Friendly)
  // -------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const procedureCards = document.querySelectorAll('.procedure-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      // Atualiza botão ativo
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filtra cards
      procedureCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        if (category === 'all' || cardCategory.includes(category)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // -------------------------------------------------------------
  // 3. Máscara de Telefone Brasileira (XX) XXXXX-XXXX
  // -------------------------------------------------------------
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 10) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (value.length > 5) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (value.length > 0) {
        value = value.replace(/^(\d*)$/, '($1');
      }
      e.target.value = value;
    });
  }

  // -------------------------------------------------------------
  // 4. Ações Rápidas nos Cards de Procedimento
  // -------------------------------------------------------------
  const procedureActionBtns = document.querySelectorAll('[data-procedure]');
  const procedureSelect = document.getElementById('procedure');
  const bookingSection = document.getElementById('agendamento');
  const nameInput = document.getElementById('fullName');

  procedureActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const procedureName = btn.getAttribute('data-procedure');
      const action = btn.getAttribute('data-action');

      if (action === 'whatsapp-direct') {
        const text = `Olá! Gostaria de agendar uma consulta sobre *${procedureName}* na Aman Clínica Odontológica.`;
        window.open(`https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
      } else {
        if (procedureSelect) {
          procedureSelect.value = procedureName;
        }
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            if (nameInput) nameInput.focus();
          }, 500);
        }
      }
    });
  });

  // -------------------------------------------------------------
  // 5. Envio do Formulário de Interesse
  // -------------------------------------------------------------
  const bookingForm = document.getElementById('bookingForm');
  const modalSuccess = document.getElementById('modalSuccess');
  const modalWhatsappLink = document.getElementById('modalWhatsappLink');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalOkBtn = document.getElementById('modalOkBtn');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fullName')?.value.trim() || '';
      const phone = document.getElementById('phone')?.value.trim() || '';
      const procedure = document.getElementById('procedure')?.value || 'Não informado';
      const shift = document.getElementById('preferredShift')?.value || 'Qualquer horário';
      const notes = document.getElementById('notes')?.value.trim() || '';

      if (!name || !phone) {
        alert('Por favor, informe seu nome e telefone.');
        return;
      }

      let message = `*Novo Agendamento - Aman Clínica Odontológica*\n\n`;
      message += `👤 *Nome:* ${name}\n`;
      message += `📱 *Telefone:* ${phone}\n`;
      message += `🦷 *Procedimento de interesse:* ${procedure}\n`;
      message += `🕒 *Melhor turno:* ${shift}\n`;
      if (notes) {
        message += `📝 *Mensagem:* ${notes}\n`;
      }
      message += `\n_Enviado pelo formulário do site._`;

      const whatsappUrl = `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(message)}`;

      if (modalWhatsappLink) {
        modalWhatsappLink.href = whatsappUrl;
      }

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      if (modalSuccess) {
        modalSuccess.classList.add('active');
      }

      bookingForm.reset();
    });
  }

  function closeModal() {
    if (modalSuccess) {
      modalSuccess.classList.remove('active');
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOkBtn) modalOkBtn.addEventListener('click', closeModal);
  if (modalSuccess) {
    modalSuccess.addEventListener('click', (e) => {
      if (e.target === modalSuccess) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
    }
  });

  // -------------------------------------------------------------
  // 6. Destaque de Link Ativo no Scroll
  // -------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navItemLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItemLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

});
