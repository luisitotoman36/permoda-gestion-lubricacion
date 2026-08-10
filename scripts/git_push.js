const { execSync } = require('child_process');
function run(cmd){
  console.log('> ' + cmd);
  execSync(cmd, { stdio: 'inherit' });
}
try{
  execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
}catch(e){
  run('git init');
}
try{ run('git add -A'); }catch(e){}
try{ run('git commit -m "Prepare project for Vercel + Render deploy"'); }catch(e){ console.log('No changes to commit or commit failed.'); }
try{ run('git branch -M main'); }catch(e){}
try{ run('git remote remove origin'); }catch(e){}
try{ run('git remote add origin https://github.com/luisrgr12/permoda-gestion-lubricacion.git'); }catch(e){ console.error('Failed to add remote:', e.message); process.exit(2); }
try{ run('git push -u origin main'); console.log('\nPUSH_OK'); }catch(e){ console.error('\nPUSH_FAILED'); console.error(e.message); process.exit(3); }
