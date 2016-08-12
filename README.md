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
	convert_options: convert_options,
	output_dir: './media/',
	gm: true //Use GraphicksMagic
})

pdf2images.pdf.convert((err, image_path) => {
	//Do something when convert every single page.
}, (images_paths) => {
	//Do something when convert full pdf file.
})

```
