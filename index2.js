const execSync = require('child_process').execSync;

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

async function distanceInMBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusKm * c * 1000.0;
}

async function generate_location_proof(x, y, xr, yr){

    var d = distanceInMBetweenEarthCoordinates(x, y, xr, yr)
    let compute_witness_command = 'zokrates compute-witness -a ' + String(d);
    console.log(compute_witness_command);
    const output1 = execSync(compute_witness_command, {cwd: './loc.zok', encoding: 'utf-8' });

    let generate_proof_command = 'zokrates generate-proof';
    const output2 = execSync(generate_proof_command, {cwd: './loc.zok', encoding: 'utf-8' });
    let proof = require("./proof.json");
   
    return proof;
}

// async function main() {
//   var location_proof = generate_location_proof(0, 0, 5, 5)
//   console.log(JSON.stringify(location_proof));
// }

// module.exports = {
//   generate_location_proof
// }

document.getElementById('get-loc-proof').addEventListener('click', function() {
  var location_proof = generate_location_proof(0, 0, 5, 5)
  console.log(JSON.stringify(location_proof))
  // document.getElementById('get-png').innerHTML = location_proof;
})