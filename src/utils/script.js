const navbar = document.querySelector('.navbar');
const toggleButton = document.getElementById('keraprof');

toggleButton.addEventListener('click', () => {
  navbar.classList.toggle('bg-light');
  navbar.classList.toggle('bg-dark');
  navbar.classList.toggle('navbar-light');
  navbar.classList.toggle('navbar-dark');
});
