
    const activities = [
      'PRELIMINARIES',
      'SUB-STRUCTURE',
      'COLUMNS AND FIRST FLOOR SLAB',
      'BRICK LAYING',
      'FINISHES',
      'ROOFING AND CEILING',
      'ELECTRICAL INSTALLATION',
      'EARTHING SYSTEM',
      'PLUMBING WORKS',
      'DRAINAGE SYSTEM',
      'SANITARY APPLIANCES',
      'WINDOWS AND DOORS'
    ];
const itemsTbody = document.getElementById('items');

    function formatNumber(n){
      if (isNaN(n) || n===null) return '0.00';
      return Number(n).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
    }

    function createRow(name, idx){
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${name}</td>
        <td class="right"><input class="subtotal" data-idx="${idx}" value="0.00" /></td>
        <td class="right"><span class="row-total" id="total-${idx}">0.00</span></td>
      `;
      return tr;
    }

    // populate rows
    activities.forEach((a,i)=> itemsTbody.appendChild(createRow(a,i)));

    // set today's date and invoice number
    document.getElementById('invdate').textContent = new Date().toLocaleDateString();
    document.getElementById('invnum').textContent = 'INV-' + String(Math.floor(Math.random()*900+100));

    // update totals
    function updateTotals(){
      let grand = 0;
      document.querySelectorAll('.subtotal').forEach(input=>{
        let v = input.value.replace(/,/g,'').trim();
        let num = parseFloat(v);
        if (isNaN(num)) num = 0;
        const idx = input.dataset.idx;
        document.getElementById('total-' + idx).textContent = formatNumber(num);
        grand += num;
      });
      document.getElementById('grand').textContent = formatNumber(grand);
    }

    // live formatting and totals
    document.addEventListener('input', function(e){
      if (e.target.classList && e.target.classList.contains('subtotal')){
        let val = e.target.value.replace(/,/g,'');
        if (isNaN(val) || val === '') val = 0;
        e.target.value = val;
        updateTotals();
      }
    });

    document.addEventListener('blur', function(e){
      if (e.target.classList && e.target.classList.contains('subtotal')){
        let num = parseFloat(e.target.value.replace(/,/g,''));
        if (isNaN(num)) num = 0;
        e.target.value = formatNumber(num);
        updateTotals();
      }
    }, true);

    // Print
    document.getElementById('print').addEventListener('click', ()=>{
      window.print();
    });

    // Reset
    document.getElementById('reset').addEventListener('click', ()=>{
      if (!confirm('Reset all amounts to 0.00?')) return;
      document.querySelectorAll('.subtotal').forEach(input=>input.value = '0.00');
      updateTotals();
    });

    // Logo drop
    (function enableLogoDrop(){
      const logo = document.getElementById('logo');
      logo.addEventListener('dragover', e=>{e.preventDefault(); logo.style.opacity = 0.8});
      logo.addEventListener('dragleave', e=>{logo.style.opacity='1'});
      logo.addEventListener('drop', e=>{
        e.preventDefault();
        const f = e.dataTransfer.files && e.dataTransfer.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = ev => {
          logo.innerHTML = '<img src="'+ev.target.result+'" style="max-width:100%;max-height:80px;object-fit:contain">';
        };
        reader.readAsDataURL(f);
      });
    })();

    // initialise totals
    updateTotals();
  
