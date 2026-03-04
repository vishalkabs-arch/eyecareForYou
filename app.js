
 => {
  e.preventDefault();
  const okFirst = validateField(els.firstName, 'firstName');
  const okLast  = validateField(els.lastName,  'lastName');
  const okAddr  = validateField(els.address,   'address');
  const okEmail = validateField(els.email,     'email');
  const okConsent = els.consent.checked;
  if (!okConsent) { alert('Please confirm consent.'); return; }
  if (!(okFirst && okLast && okAddr && okEmail)) return;

  addCustomer({
    firstName: els.firstName.value.trim(),
    lastName:  els.lastName.value.trim(),
    address:   els.address.value.trim(),
    email:     els.email.value.trim()
  });
  clearForm();
});

['input','blur'].forEach(evt => {
  els.firstName.addEventListener(evt, () => validateField(els.firstName,'firstName'));
  els.lastName .addEventListener(evt, () => validateField(els.lastName, 'lastName'));
  els.address  .addEventListener(evt, () => validateField(els.address,  'address'));
  els.email    .addEventListener(evt, () => validateField(els.email,    'email'));
});
els.resetBtn.addEventListener('click', clearForm);

els.tbody.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const tr = e.target.closest('tr');
  const id = tr?.dataset?.id;
  if (!id) return;
  const action = btn.dataset.action;
  if (action === 'delete') {
    if (confirm('Delete this customer?')) deleteCustomer(id);
  } else if (action === 'edit') {
    openEdit(id);
  }
});

els.saveEditBtn.addEventListener('click', saveEdit);

els.search.addEventListener('input', debounce(applyFilters, 120));
els.sort.addEventListener('change', () => {
  const [k, d] = els.sort.value.split('_');
  sortKey = k; sortDir = d;
  applyFilters();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && typeof els.editModal?.close === 'function') els.editModal.close();
});
els.exportBtn.addEventListener('click', () => exportCsv(filtered));

// helpers
function debounce(fn, ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; }

// Initialize
applyFilters();
