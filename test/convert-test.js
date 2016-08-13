var fs = require('fs');
var test = require('tape')
var path = require('path')
var PDFImage = require('pdf-image').PDFImage
var PDF2Images = require('../')
var async = require('async');

function json_test (t, data, text) {
	t.ok(data instanceof {}.constructor, text)
}

function func_test (t, data, text) {
	type_equals_test(t, data, 'function', text)
}

function ok_number (t, data, text) {
	t.ok( ! isNaN(Number(data)), text)
}

function type_equals_test (t, data, type_equal, text) {
	t.equals(typeof data, type_equal, text)
}

test('should create pdf2images object properly', function (t) {
	t.ok(PDF2Images, 'PDF2Images should exist')
	func_test(t, PDF2Images, 'PDF2Images should be a function')

	var allow_img_formats = ['png', 'jpeg', 'jpg', ]
	var convert_options = {
	  '-trim': '',
	  '-density' : 150,
	  '-quality' : 100,
	  '-sharpen' : '0x1.0'
	}
	var output_dir = path.join(__dirname, 'pdf-output')
	var pdf_file_path = path.join(__dirname, 'test.pdf')


	var pdf_options = {
	  convert_options: convert_options,
	  output_dir: output_dir
	}

	var pdf2images = PDF2Images(pdf_file_path, pdf_options)

	var file_name_ext = path.basename(pdf_file_path)
	var file_name = file_name_ext.split('.')[0]
	var dirname = path.dirname(pdf_file_path)

	t.ok(pdf2images, 'pdf2images should exist')
	json_test(t, pdf2images, 'pdf2images should be a json object')

	t.ok(pdf2images.add_foo_not_repeat, 'add_foo_not_repeat property should exist')
	func_test(t, pdf2images.add_foo_not_repeat, 'add_foo_not_repeat property should be a function')

	t.ok(pdf2images.pdf, 'pdf property should exist')
	json_test(t, pdf2images.pdf, 'pdf property should be a json object')

	t.ok(pdf2images.options, 'options property should exist')
	json_test(t, pdf2images.options, 'options property should be a json object')
	t.equals(pdf2images.options, pdf_options, 'pdf.options should be equals to pdf_options')

	t.ok(pdf2images.pdf.gpn_working === false || pdf2images.pdf.gpn_working === true, 'pdf.gpn_working should be equal to true or false')

	t.ok(pdf2images.img.get_image_path_number, 'img.get_image_path_number property should exist')
	func_test(t, pdf2images.img.get_image_path_number, 'img.get_image_path_number property should be a function')

	t.ok(pdf2images.pdf.remove_to_converting, 'pdf.remove_to_converting property should exist')
	func_test(t, pdf2images.pdf.remove_to_converting, 'pdf.remove_to_converting property should be a function')

	t.ok(pdf2images.pdf.remove_to_converting, 'pdf.remove_to_converting property should exist')
	func_test(t, pdf2images.pdf.remove_to_converting, 'pdf.remove_to_converting property should be a function')

	t.ok(pdf2images.pdf.convert, 'convert property should exist')
	func_test(t, pdf2images.pdf.convert, 'convert property should be a function')

	t.ok(pdf2images.pdf.convert_chunks, 'convert_chunks property should exist')
	func_test(t, pdf2images.pdf.convert_chunks, 'convert_chunks property should be a function')

	t.ok(pdf2images.pdf.convert_pages, 'convert_pages property should exist')
	func_test(t, pdf2images.pdf.convert_pages, 'convert_pages property should be a function')

	t.ok(pdf2images.pdf.get_file_name, 'get_file_name property should exist')
	func_test(t, pdf2images.pdf.get_file_name, 'get_file_name property should be a function')
	t.equals(pdf2images.pdf.get_file_name(), file_name, 'get_file_name should be equals to file_name')

	t.ok(pdf2images.pdf.get_file_name_ext, 'get_file_name property should exist')
	func_test(t, pdf2images.pdf.get_file_name_ext, 'get_file_name property should be a function')
	t.equals(pdf2images.pdf.get_file_name_ext(), file_name_ext, 'get_file_name_ext should be equals to file_name_ext')

	t.ok(pdf2images.pdf.get_dirname, 'get_dirname property should exist')
	func_test(t, pdf2images.pdf.get_dirname, 'get_dirname property should be a function')
	t.equals(pdf2images.pdf.get_dirname(), dirname, 'get_dirname should be equals to dirname')

	t.ok(pdf2images.pdf.file_path, 'pdf.file_path property should exist')
	t.equals(pdf2images.pdf.file_path, pdf_file_path, 'pdf.file_path should be equals to pdf_file_path')

	t.ok(pdf2images.pdf.file_path, 'pdf.file_path property should exist')
	t.equals(pdf2images.pdf.file_path, pdf_file_path, 'pdf.file_path should be equals to pdf_file_path')

	t.ok(pdf2images.pdf.PDFImage instanceof PDFImage, 'pdf.PDFImage should be instance of PDFImage')

	t.ok(pdf2images.pdf.f_converting, 'pdf.f_converting should be exist')
	t.ok(Array.isArray(pdf2images.pdf.f_converting), 'pdf.f_converting should be an array')

	t.ok(pdf2images.img, 'img property should exist')
	json_test(t, pdf2images.img, 'img property should be a json object')

	t.ok(pdf2images.img.get_default_format, 'get_default_format property should exist')
	func_test(t, pdf2images.img.get_default_format, 'get_default_format property should be a function')

	var img_format_index = allow_img_formats.indexOf(pdf2images.img.get_default_format())

	t.ok(img_format_index >= 0, 'Image format should be allowed.')
	t.ok(allow_img_formats[img_format_index], 'img_format_index should have a value in allow_img_formats.')

	t.ok(pdf2images.pdf.get_page_number, 'get_page_number property should exist')
	func_test(t, pdf2images.pdf.get_page_number, 'get_page_number property should be a function')

	pdf2images.pdf.get_page_number((err, pages) => {
		t.error(err, 'should not be an error in get_page_number')
		t.ok(pages, 'pages should be exist')
		ok_number(t, pages, 'pages should be numeric')

		t.ok(pdf2images.pdf.pages, 'pdf.pages should be exist')
		ok_number(t, pdf2images.pdf.pages, 'pdf.pages should be numeric')

		t.end()
	})
})

test('should convert pdf to images without options', function (t) {
	var pdf_file_path = path.join(__dirname, 'test.pdf')
	var file_ext_name = path.extname(pdf_file_path)

	var pdf2images = PDF2Images(pdf_file_path)
	var single_conv_funct_counter = 0
		
	pdf2images.pdf.convert((err, image_path) => {
		fs.access(image_path || '', fs.F_OK, err => {
			t.error(err, 'File ' + image_path + ' created successfully')

			if ( ! err ) fs.unlink(image_path)
		})

		t.error(err, 'should not be an error in convert single image')
		t.ok(image_path, 'image_path should be exist')
		++single_conv_funct_counter

	}, (err, images_paths) => {
		t.error(err, 'should not be an error in convert final')
		t.ok(images_paths, 'images_paths should be exist')
		t.ok(Array.isArray(images_paths), 'images_paths should be an array')
		t.equals(images_paths.length, single_conv_funct_counter, 'images_paths.length should be equal to single_conv_funct_counter')
		t.equals(images_paths.length, pdf2images.pdf.pages, 'images_paths.length should be equal to pdf.pages')
		t.equals(images_paths, pdf2images.img.paths, 'images_paths should be equal to img.paths')

		pdf2images.pdf.set_page_number()

		pdf2images.pdf.set_page_number(err => {
			t.error(err, 'should not be an error in set_page_number')
			t.end()
		})
		
	})
})

test('should convert pdf to images', function (t) {
	var convert_options = {
	  '-trim': '',
	  '-density' : 150,
	  '-quality' : 100,
	  '-sharpen' : '0x1.0'
	}
	var output_dir = path.join(__dirname, 'pdf-output')
	var pdf_file_path = path.join(__dirname, 'test.pdf')
	var file_ext_name = path.extname(pdf_file_path)

	var pdf_options = {
	  convert_options: convert_options,
	  output_dir: output_dir
	}

	var pdf2images = PDF2Images(pdf_file_path, pdf_options)
	var single_conv_funct_counter = 0
		
	pdf2images.pdf.convert((err, image_path) => {
		fs.access(image_path || '', fs.F_OK, err => {
			t.error(err, 'File ' + image_path + ' created successfully')

			if ( ! err ) fs.unlink(image_path)
		})

		t.error(err, 'should not be an error in convert single image')
		t.ok(image_path, 'image_path should be exist')
		++single_conv_funct_counter

	}, (err, images_paths) => {
		t.error(err, 'should not be an error in convert final')
		t.ok(images_paths, 'images_paths should be exist')
		t.ok(Array.isArray(images_paths), 'images_paths should be an array')
		t.equals(images_paths.length, single_conv_funct_counter, 'images_paths.length should be equal to single_conv_funct_counter')
		t.equals(images_paths.length, pdf2images.pdf.pages, 'images_paths.length should be equal to pdf.pages')
		t.equals(images_paths, pdf2images.img.paths, 'images_paths should be equal to img.paths')

		pdf2images.pdf.set_page_number()

		pdf2images.pdf.set_page_number(err => {
			t.error(err, 'should not be an error in set_page_number')
			t.end()
		})
		
	})
})

test('should convert pdf to images by chunks', function (t) {
	var convert_options = {
	  '-trim': '',
	  '-density' : 150,
	  '-quality' : 100,
	  '-sharpen' : '0x1.0'
	}
	var output_dir = path.join(__dirname, 'pdf-output')
	var pdf_file_path = path.join(__dirname, 'test.pdf')
	var file_ext_name = path.extname(pdf_file_path)

	var pdf_options = {
	  convert_options: convert_options,
	  output_dir: output_dir
	}

	var pdf2images = PDF2Images(pdf_file_path, pdf_options)
	var single_conv_funct_counter = 0
	var chunks = 5
		
	pdf2images.pdf.convert_chunks((err, image_path) => {
		fs.access(image_path || '', fs.F_OK, err => {
			t.error(err, 'File ' + image_path + ' created successfully')

			if ( ! err ) fs.unlink(image_path)
		})

		t.error(err, 'should not be an error in convert_chunks single image')
		t.ok(image_path, 'image_path should be exist')
		++single_conv_funct_counter

	}, (err, images_paths) => {
		t.error(err, 'should not be an error in convert_chunks final')
		t.ok(images_paths, 'images_paths should be exist')
		t.ok(Array.isArray(images_paths), 'images_paths should be an array')
		t.equals(images_paths.length, single_conv_funct_counter, 'images_paths.length should be equal to single_conv_funct_counter')
		t.equals(images_paths.length, pdf2images.pdf.pages, 'images_paths.length should be equal to pdf.pages')
		t.equals(images_paths, pdf2images.img.paths, 'images_paths should be equal to img.paths')

		t.end()
	}, chunks)
})

test('should be fail converting pdf to images', function (t) {
	var convert_options = {
	  '-trim': '',
	  '-density' : 150,
	  '-quality' : 100,
	  '-sharpen' : '0x1.0'
	}
	var output_dir = path.join(__dirname, 'pdf-output')
	var pdf_file_path = path.join(__dirname, 'test-sdadfasfdsa.pdf')
	var file_ext_name = path.extname(pdf_file_path)

	var pdf_options = {
	  convert_options: convert_options,
	  output_dir: output_dir
	}

	var pdf2images = PDF2Images(pdf_file_path, pdf_options)

	pdf2images.pdf.remove_to_converting(1)

	function spn_test (cb) {
		pdf2images.pdf.set_page_number(err => {
			t.ok(err, 'should be an error in set_page_number')

			cb()
		})
	}

	function convert_pages_test (cb) {
		pdf2images.pdf.convert_pages([1], (err, image_path) => {
			fs.access(image_path || '', fs.F_OK, err => {
				t.ok(err, 'File not created')
			})

			t.ok(err, 'should be an error in convert single image')
			t.ok( ! image_path, 'image_path should not be exist')

			if (err) cb()

		}, (err, images_paths) => {
			t.ok(err, 'should be an error in convert final')
			t.ok( ! images_paths, 'images_paths should not be exist')

			cb()
		})	
	}

	function s_convert_pages_test (cb) {
		pdf2images.pdf.convert_pages([-10, 'a'], (err, image_path) => {
			fs.access(image_path || '', fs.F_OK, err => {
				t.ok(err, 'File not created')
			})

			t.ok(err, 'should be an error in convert single image')
			t.ok( ! image_path, 'image_path should not be exist')

			if (err) cb()

		}, (err, images_paths) => {
			t.ok(err, 'should be an error in convert final')
			t.ok( ! images_paths, 'images_paths should not be exist')

			cb()
		})	
	}

	function convert_chunks_test (cb) {
		var chunks = -10
		var s_pdf_file_path = path.join(__dirname, 'test.pdf')

		var s_pdf2images = PDF2Images(s_pdf_file_path, pdf_options)

		s_pdf2images.pdf.convert_chunks((err, image_path) => {
			fs.access(image_path || '', fs.F_OK, err => {
				t.ok(err, 'File not created')
			})

			t.ok(err, 'should be an error in convert single image')
			t.ok( ! image_path, 'image_path should not be exist')

			if (err) cb()

		}, (err, images_paths) => {
			t.ok(err, 'should be an error in convert final')
			t.ok( ! images_paths, 'images_paths should not be exist')

			cb()
			
		}, chunks)	
	}

	function convert_test (cb) {
		pdf2images.pdf.convert((err, image_path) => {
			fs.access(image_path || '', fs.F_OK, err => {
				t.ok(err, 'File not created')
			})

			t.ok(err, 'should be an error in convert single image')
			t.ok( ! image_path, 'image_path should not be exist')

			if (err) cb()

		}, (err, images_paths) => {
			t.ok(err, 'should be an error in convert final')
			t.ok( ! images_paths, 'images_paths should not be exist')

			cb()
		})	
	}

	async.series([
		spn_test,
		convert_pages_test,
		s_convert_pages_test,
		convert_chunks_test,
		convert_test
	], err => {
		t.end()
	})

})