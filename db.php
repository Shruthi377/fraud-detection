* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(to right, #f3f4f6, #e0e7ff);
  color: #333;
}

header {
  background-color: #1e293b;
  padding: 20px 0;
  color: white;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

header h1 {
  font-size: 2rem;
}

nav ul {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-top: 10px;
}

nav ul li a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

nav ul li a:hover {
  color: #93c5fd;
}

.container {
  width: 90%;
  max-width: 1000px;
  margin: auto;
}

main {
  padding: 40px 0;
  display: grid;
  gap: 30px;
}

.card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card h2 {
  margin-bottom: 20px;
  color: #1e40af;
}

form input, form button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1rem;
}

form input:focus {
  outline: none;
  border-color: #2563eb;
}

button {
  background-color: #1e40af;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #1d4ed8;
}

footer {
  text-align: center;
  padding: 20px;
  background-color: #1e293b;
  color: white;
  margin-top: 30px;
  font-size: 0.9rem;
}
