const fs = require('fs');
const path = require('path');
const walk = (dir) => {
  let list = fs.readdirSync(dir);
  for (let file of list) {
    file = path.join(dir, file);
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) walk(file);
    else if (file.endsWith('.jsx')) {
      let content = fs.readFileSync(file, 'utf8');
      let original = content;
      
      content = content.replace(/from\s+['"]\.\.\/context\/AuthContext['"]/g, "from '../../Context/AuthContext'");
      content = content.replace(/from\s+['"]\.\.\/\.\.\/context\/AuthContext['"]/g, "from '../../Context/AuthContext'");
      content = content.replace(/from\s+['"]\.\.\.\/context\/AuthContext['"]/g, "from '../Context/AuthContext'");
      content = content.replace(/from\s+['"]\.\/\.\.\/context\/AuthContext['"]/g, "from '../../Context/AuthContext'");
      
      content = content.replace(/from\s+['"](.*)UI\/(.*)['"]/g, "from '$1Ui/$2'");
      
      if (file.includes('Worker') || file.includes('JobGiver')) {
        content = content.replace(/from\s+['"]\.\/Ui\/(.*)['"]/g, "from '../Ui/$1'");
      }
      
      if (file.endsWith('Navbar.jsx') || file.endsWith('Home.jsx') || file.endsWith('ChooseYourPath.jsx') || file.endsWith('Login.jsx') || file.endsWith('Register.jsx')) {
        content = content.replace(/from\s+['"]\.\.\/Ui\/(.*)['"]/g, "from './Ui/$1'");
      }
      
      if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed:', file);
      }
    }
  }
};
walk('src');
