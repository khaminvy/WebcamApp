import express from 'express';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import util from 'util';

const router = express.Router();

/** API path that will upload the files */
router.get('/', function(req, res) {
	res.end("I got you!")
})

router.get('/images', function(req, res, next) {
	getImages("./public/uploads", function (err, files) {
			var imageLists = "";
			var tempStr = ''
			files.forEach(function(ele){
				tempStr = tempStr + ele + ",";
			});
			imageLists = tempStr.substring(0, tempStr.length - 1);
            res.writeHead(200, {'Content-type':'text/plain'});
		    res.end(imageLists);
        });
});

router.post('/upload', function(req, res) {
	console.log("We go to uploading process...")
	let form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {

		const formName = Object.keys(files)[0];
		const data = JSON.parse(fields.data);
		const fileName = JSON.stringify(data.lat) + "W" + JSON.stringify(data.lon) + "W" + JSON.stringify(data.timestamp)
		const file = (fileName.split(".").join("_"))+".jpg";

		if(files[formName]){	
			const oldPath = files[formName].path;
			const newPath = path.join('./public/uploads/', file);
			fs.readFile(oldPath, function(err, data) {		
				fs.writeFile(newPath, data, function(err) {
					fs.unlink(oldPath, function(err) {
						if (err) {
							res.status(500);
							res.json({'success': false});
						} else {
							res.status(200);
							res.json({'success': true});
						}
					});
				});	
			});
		}
	})
})

/////////////////////Helper Functions/////////
//get the list of jpg files in the uploads dir
function getImages(imageDir, callback) {
	const fileType = '.jpg';
	let files = [];
	let i = 0;
    fs.readdir(imageDir, function (err, list) {
        for(i=0; i<list.length; i++) {
            if(path.extname(list[i]) === fileType) {
                files.push("uploads/" + list[i]); //store the file name into the array files
            }
        }
        callback(err, files);
    });
}

module.exports = router;


