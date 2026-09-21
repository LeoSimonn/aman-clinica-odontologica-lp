/**
 * AMAN CLÍNICA ODONTOLÓGICA - JAVASCRIPT PRINCIPAL
 * Interações, máscara de telefone, navegação e integração com WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  const CLINIC_WHATSAPP = '5551999208117'; // (51) 99920-8117
  
  // -------------------------------------------------------------
  // 1. Menu Mobile
  // -------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Fechar menu ao clicar em qualquer link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -------------------------------------------------------------
  // 2. Máscara de Telefone Brasileira (XX) XXXXX-XXXX
  // -------------------------------------------------------------
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 10) {
        // Formato celular (11 dígitos): (XX) XXXXX-XXXX
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (value.length > 5) {
        // Formato intermediário: (XX) XXXX-XXXX
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (value.length > 2) {
        // Formato DDD: (XX) XXX...
        value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (value.length > 0) {
        value = value.replace(/^(\d*)$/, '($1');
      }
      e.target.value = value;
    });
  }

  // -------------------------------------------------------------
  // 3. Seleção Rápida de Procedimento nos Cards
  // -------------------------------------------------------------
  const procedureButtons = document.querySelectorAll('[data-procedure]');
  const procedureSelect = document.getElementById('procedure');
  const bookingSection = document.getElementById('agendamento');
  const nameInput = document.getElementById('fullName');

  procedureButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const procedureName = btn.getAttribute('data-procedure');
      const action = btn.getAttribute('data-action');

      if (action === 'whatsapp-direct') {
        // Direto no WhatsApp
        const text = `Olá! Gostaria de agendar uma consulta sobre *${procedureName}* na Aman Clínica Odontológica.`;
        window.open(`https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
      } else {
        // Preenche no formulário e rola até ele
        if (procedureSelect) {
          procedureSelect.value = procedureName;
        }
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            if (nameInput) nameInput.focus();
          }, 600);
        }
      }
    });
  });

  // -------------------------------------------------------------
  // 4. Envio do Formulário de Interesse
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
        alert('Por favor, preencha seu nome e telefone.');
        return;
      }

      // Montar mensagem amigável para o WhatsApp da clínica
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

      // Atualiza link de backup no modal
      if (modalWhatsappLink) {
        modalWhatsappLink.href = whatsappUrl;
      }

      // Abre WhatsApp
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Exibe modal de confirmação
      if (modalSuccess) {
        modalSuccess.classList.add('active');
      }

      // Limpa formulário
      bookingForm.reset();
    });
  }

  // Fechar Modal
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
    if (e.key === 'Escape' && modalSuccess && modalSuccess.classList.contains('active')) {
      closeModal();
    }
  });

  // -------------------------------------------------------------
  // 5. Destacar Link Ativo no Menu Durante a Rolagem
  // -------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
});
