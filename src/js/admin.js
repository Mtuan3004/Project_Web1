var orders = [
  {
    id: '#PP2481',
    customer: 'Minh Anh',
    product: 'Royal Canin Mini Adult',
    total: 845000,
    status: 'Đã giao',
  },
  {
    id: '#PP2480',
    customer: 'Tuấn Khang',
    product: 'Cát vệ sinh Cature',
    total: 325000,
    status: 'Đang giao',
  },
  {
    id: '#PP2479',
    customer: 'Phương Nhi',
    product: 'Balo vận chuyển',
    total: 590000,
    status: 'Chờ xử lý',
  },
  {
    id: '#PP2478',
    customer: 'Hoàng Nam',
    product: 'Pate mèo Catchy',
    total: 275000,
    status: 'Đã giao',
  },
];

var orderTable = document.getElementById('orderTable');
var searchInput = document.getElementById('searchInput');
var statusFilter = document.getElementById('statusFilter');
var orderForm = document.getElementById('orderForm');
var emptyMessage = document.getElementById('emptyMessage');

function formatMoney(number) {
  return number.toLocaleString('vi-VN') + 'đ';
}

function getStatusClass(status) {
  if (status === 'Đã giao') {
    return 'done';
  }

  if (status === 'Đang giao') {
    return 'shipping';
  }

  return 'waiting';
}

function showOrders() {
  var keyword = searchInput.value.toLowerCase();
  var selectedStatus = statusFilter.value;
  var html = '';
  var resultCount = 0;

  for (var i = 0; i < orders.length; i++) {
    var order = orders[i];
    var matchesKeyword =
      order.id.toLowerCase().includes(keyword) ||
      order.customer.toLowerCase().includes(keyword);
    var matchesStatus =
      selectedStatus === 'Tất cả' || order.status === selectedStatus;

    if (matchesKeyword && matchesStatus) {
      resultCount++;
      html +=
        '<tr>' +
        '<td>' +
        order.id +
        '</td>' +
        '<td>' +
        order.customer +
        '</td>' +
        '<td>' +
        order.product +
        '</td>' +
        '<td>' +
        formatMoney(order.total) +
        '</td>' +
        '<td><span class="status ' +
        getStatusClass(order.status) +
        '">' +
        order.status +
        '</span></td>' +
        '</tr>';
    }
  }

  orderTable.innerHTML = html;

  if (resultCount === 0) {
    emptyMessage.classList.remove('hidden');
  } else {
    emptyMessage.classList.add('hidden');
  }
}

function showMessage(text) {
  var message = document.getElementById('message');
  message.innerText = text;
  message.classList.add('show');

  setTimeout(function () {
    message.classList.remove('show');
  }, 2000);
}

searchInput.addEventListener('input', showOrders);
statusFilter.addEventListener('change', showOrders);

document
  .getElementById('showFormButton')
  .addEventListener('click', function () {
    orderForm.classList.remove('hidden');
  });

document.getElementById('cancelButton').addEventListener('click', function () {
  orderForm.classList.add('hidden');
  orderForm.reset();
});

orderForm.addEventListener('submit', function (event) {
  event.preventDefault();

  var newOrder = {
    id: '#PP' + (2482 + orders.length - 4),
    customer: document.getElementById('customerName').value,
    product: document.getElementById('productName').value,
    total: Number(document.getElementById('orderTotal').value),
    status: document.getElementById('orderStatus').value,
  };

  orders.unshift(newOrder);
  orderForm.reset();
  orderForm.classList.add('hidden');
  searchInput.value = '';
  statusFilter.value = 'Tất cả';
  showOrders();
  showMessage('Đã thêm đơn hàng mới.');
});

var menuItems = document.querySelectorAll('.menu-item');

for (var i = 0; i < menuItems.length; i++) {
  menuItems[i].addEventListener('click', function () {
    document.querySelector('.menu-item.active').classList.remove('active');
    this.classList.add('active');
    document.getElementById('pageTitle').innerText = this.dataset.title;
    document.getElementById('sidebar').classList.remove('open');
  });
}

document.getElementById('mobileMenu').addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle('open');
});

document
  .getElementById('collapseButton')
  .addEventListener('click', function () {
    document.body.classList.toggle('sidebar-collapsed');
  });

showOrders();
// hehehehehhehehhe
function updateStatWithTrend(
  currentVal,
  prevVal,
  elementId,
  textLabel = 'so với hôm qua'
) {
  const trendElement = document.getElementById(elementId);
  const countElement = document.getElementById('order-count');

  if (!trendElement) return;

  // Cập nhật số lượng hiển thị chính
  if (countElement) {
    countElement.textContent = currentVal.toLocaleString();
  }

  // Tính phần trăm chênh lệch: ((Hôm nay - Hôm qua) / Hôm qua) * 100
  let percentChange = 0;
  if (prevVal > 0) {
    percentChange = ((currentVal - prevVal) / prevVal) * 100;
  } else if (currentVal > 0) {
    percentChange = 100; // Trường hợp hôm qua = 0 mà hôm nay có dữ liệu
  }

  // Xác định tăng hay giảm
  let isIncrease = percentChange >= 0;
  let arrow = isIncrease ? '↑' : '↓';
  let trendClass = isIncrease ? 'trend-up' : 'trend-down';

  // Lấy giá trị tuyệt đối và làm tròn 1 chữ số thập phân (hoặc toFixed(0) để lấy số tròn)
  let formattedPercent = Math.abs(percentChange).toFixed(0) + '%';

  // Đổ kết quả ra HTML
  trendElement.innerHTML = `
        <span class="${trendClass}">${arrow} ${formattedPercent}</span> ${textLabel}
    `;
}
