#pdf2images-multiple

##Usage

``` js

var PDF2Images = require('pdf2images-multiple')

var convert_options = {
	'-trim': '',
	'-density' : 150,
	'-quality' : 100,
	'-sharpen' : '0x1.0'
}

var pdf2images = PDF2Images('./foodir/foo.pdf', {
	convert_options: convert_options, //optional
	output_dir: './media/', //optional
	ext: 'jpg' //optional, png is the default value
	gm: true //Use GraphicksMagic //optional, false is the default value
})

pdf2images.pdf.convert((err, image_path) => {
	//Do something when convert every single page.
}, (err, images_paths) => {
	//Do something when convert full pdf file.
})

//You can do it by chunks
var chunks = 4

//Convert 4 pages at the same time
pdf2images.pdf.convert_chunks((err, image_path) => {
	//Do something when convert every single page.
}, (err, images_paths) => {
	//Do something when convert full pdf file.
}, chunks)	

//Optionaly you can choose the pages to convert by page number
pdf2images.pdf.convert_pages([0,4,6,7], (err, image_path) => {
	//Do something when convert every single page.
}, (err, images_paths) => {
	//Do something when convert full pdf file.
})	

//You can convert a single page
pdf2images.pdf.convert_page(0, (err, image_path) => {
	//Do something when convert the page.
})	
```

##Warning

###This package require to install this packages: imagemagick, ghostscript, poppler-utils and GraphicsMagick
###On ubuntu or debian exec: apt-get install -y imagemagick ghostscript poppler-utils GraphicsMagick