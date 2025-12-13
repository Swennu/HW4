<template>
  <div>
    <nav>
        <ul>
          <li><router-link to="/login" class="nav-item">Login</router-link></li>
          <li><router-link to="/" class="nav-item">About</router-link></li>
        </ul>
      </nav>
    </div>

</template>
<script>
  export default {
  name: "Navbar",
};

</script>
<style scoped>

/* Navigation bar */
nav ul {
  display: flex;
  gap: 30px;
  list-style: none;
  background: #cecccc;
  padding: 1rem;
  margin: 0;
}
.nav-item {
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  color: black;
}
.nav-item:hover {
  background-color: #9c9a9a; 
}

  nav {
    background-color: #ccc;
    display: flex;
    justify-content: space-between;  /* keeps menu on left and profile on right */
    align-items: center;
    padding: 10px 20px;
  }

  nav a {
    text-decoration: none;
    color: #000;
    font-weight: bold;
  }
  
    .menu-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  /* Footer */
footer {
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 1rem;
  background-color: #e2e2e2;
  margin-top: 2rem;
  }
  .dropdown {
    position: absolute;
    right: 0;
    top: 45px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    border-radius: 6px;
    width: 180px;
    z-index: 1;
  }

  .dropdown p, .dropdown a {
    padding: 10px;
    margin: 0;
    font-size: 14px;
  }

  .dropdown a {
    display: block;
    text-decoration: none;
    color: #333;
  }

  .dropdown a:hover {
    background-color: #f0f0f0;
  }

    .profile {
    position: relative;
    cursor: pointer;
  }

  .profile img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
</style>