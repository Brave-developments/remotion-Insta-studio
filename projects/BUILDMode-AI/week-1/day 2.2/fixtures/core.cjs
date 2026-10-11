const fs=require('fs');
function csvCell(value){const str=String(value??'');return /[",\r\n]/.test(str)?'"'+str.replaceAll('"','""')+'"':str;}
function exportCsv(headers,rows){return [headers,...rows.map(row=>headers.map(key=>row[key]))].map(row=>row.map(csvCell).join(',')).join('\r\n');}
function renamePreview(files){const used=new Set();return files.map(file=>{const safe=String(file.category||'other').toLowerCase().replace(/[^a-z0-9-]/g,'')||'other';const ext=String(file.name).match(/\.[a-zA-Z0-9]+$/)?.[0]||'.png';let n=1,target;do{target=`${safe}-${String(n++).padStart(2,'0')}${ext}`;}while(used.has(target.toLowerCase()));used.add(target.toLowerCase());return {from:file.name,to:target,category:safe};});}
function moveCard(cards,id,column){if(!['To do','Doing','Done'].includes(column))throw Error('Invalid column');return cards.map(card=>card.id===id?{...card,column}:card);}
function collision(player,obstacle){return player.x<obstacle.x+obstacle.w&&player.x+player.w>obstacle.x&&player.y<obstacle.y+obstacle.h&&player.y+player.h>obstacle.y;}
module.exports={csvCell,exportCsv,renamePreview,moveCard,collision};
