var PDFImage = require('pdf-image').PDFImage
var path = require('path');

function range (begin_int, end_int) {
	var arr = [],
	    i = begin_int

	while(i < end_int) {
		arr.push(i)

		++i
	}

	return arr
}

function PDF2Images (pdf_file_path, options) {

	var self = {}
	self.pdf = {}
	self.img = {}

	self.ConstructorFunc = function () {
		self.img.paths = []
		self.pdf.f_converting = []

		self.img.default_format = 'png'

		self.pdf.file_path = pdf_file_path
		self.options = options

		self.pdf.gpn_working = false

		self.pdf.file_name_ext = path.basename(self.pdf.file_path)
		self.pdf.file_name = self.pdf.file_name_ext.split('.')[0]
		self.pdf.dirname = path.dirname(self.pdf.file_path)

		self.pdf.set_PDFImage()

		self.pdf.set_page_number()
	}

	self.pdf.convert_page = function (page, callback) {
		var pdfImg = self.pdf.PDFImage
		var success_cb, error_cb

		success_cb = (image_path) => {
			self.img.add_path(image_path)

			callback(null, image_path)
		}

		error_cb = (err) => {				
			callback(err)
		}

		pdfImg.convertPage(page).then(success_cb, error_cb)
	}

	self.pdf.convert_pages = function (pages_arr, page_cb, final_cb) {
		var length = pages_arr.length

		if ( ! length ) return final_cb(new Error('pages_arr is empty'))

		var begin_img_path_length = self.img.paths.length
		var fail = false
		var callback = (err, image_path) => {	
	  	if (err) {
	  		fail = true
	  		return page_cb(err)
	  	}

	  	page_cb(null, image_path)

	  	if (pages_arr.length == 1 || pages_arr.length == (self.img.paths.length - begin_img_path_length)) {
	  		final_cb(null, self.img.paths)
	  	}
	  }

	  var val

		while ( ! fail && length ) {
			--length
			val = pages_arr[length]

			if ( isNaN(val) ) {
				fail = true
				return callback(new Error('pages_arr contains invalid value: "' + val + '"'))
			}

			self.pdf.convert_page(val, callback)
		}
	}

	self.pdf.convert = function (page_cb, final_cb) {
		self.pdf.convert_chunks(page_cb, final_cb)
	}

	self.pdf.convert_chunks = function (page_cb, final_cb, chunks_numb) {
		var get_page_cb = (err, pages) => {
			if (err) {
				return final_cb(err)
			}

			begin = self.pdf.f_converting.length + self.img.paths.length

			var end = begin + chunks_numb
			end = chunks_numb && end <= pages ? end : pages

			var pages_chunk_arr = range(begin, end)
			var convert_one = 1
			var image_path_number

			self.pdf.add_to_converting(pages_chunk_arr)

			var cc_final_cb = (err, images_paths) => {		
				if (err) return final_cb(err)
				if ( self.img.paths.length == pages ) return final_cb(null, self.img.paths)				
			}

			self.pdf.convert_pages(pages_chunk_arr, (err, image_path) => {
				if (err) return page_cb(err)

				image_path_number = self.img.get_image_path_number(image_path)

				self.pdf.remove_to_converting([image_path_number])

				begin = self.pdf.f_converting.length + self.img.paths.length

				if ( begin < pages ) {
					self.pdf.convert_chunks(page_cb, cc_final_cb, convert_one)
				}

				page_cb(null, image_path)

			}, cc_final_cb)
		}

		self.pdf.get_page_number(get_page_cb)
	}

	self.pdf.set_PDFImage = function () {
		self.pdf.PDFImage = new PDFImage(self.pdf.file_path, {
			convertExtension: self.options.ext || self.img.get_default_format(),
			outputDirectory: self.options.output_dir,
			convertOptions: self.options.convert_options
		})

		self.pdf.PDFImage.pdfFileBaseName = self.options.base_name || self.pdf.get_file_name()
		self.pdf.PDFImage.useGM = self.options.gm || false
	}

	self.pdf.set_page_number = function (cb) {
		if ( self.pdf.pages != undefined ) {
			return cb ? cb() : undefined
		}

		var callback = (err, pages) => {
			if (err && cb) return cb(err)
			if (err) return

			self.pdf.pages = pages
		}

		self.pdf.get_page_number(callback)
	}

	self.pdf.get_page_number = function (cb) {
		if ( self.pdf.gpn_working ) return setTimeout(() => self.pdf.get_page_number(cb), 0)
		self.pdf.gpn_working = true

		if ( self.pdf.pages != undefined ) { 
			self.pdf.gpn_working = false
			return cb(null, self.pdf.pages)
		}

		var callback = (pages) => {		
			cb(null, Number(pages))
			self.pdf.gpn_working = false
		}
		var e_cb = (error) => {
			cb(error)
			self.pdf.gpn_working = false
		}
		
		self.pdf.PDFImage.numberOfPages().then(callback, e_cb)

	}

	self.pdf.get_file_name_ext = function () {
		return self.pdf.file_name_ext
	}

	self.pdf.get_file_name = function () {
		return self.pdf.file_name
	}

	self.pdf.get_dirname = function () {
		return self.pdf.dirname
	}

	self.img.get_default_format = function () {
		return self.img.default_format
	}

	self.img.add_path = function (path) {
		self.add_foo_not_repeat(self.img.paths, path)
	}

	self.img.get_image_path_number = function (image_path) {
		var splitted = image_path.split(/-|\./)

		return Number(splitted[splitted.length - 2])
	}

	self.pdf.add_to_converting = function (pages) {
		var length = pages.length

		while (length) {
			--length

			self.add_foo_not_repeat(self.pdf.f_converting, pages[length])
		}
	}

	self.pdf.remove_to_converting = function (pages) {
		if ( ! pages || ! Array.isArray(pages) ) return

		var f_converting_length = self.pdf.f_converting.length
		var pages_length = pages.length		
		var new_arr = []
		var indexs_to_del = []
		var page_numb

		while (pages_length) {
			--pages_length
			indexs_to_del.push(self.pdf.f_converting.indexOf(pages[pages_length]))
		}

		while (f_converting_length) {
			--f_converting_length
			page_numb = self.pdf.f_converting[f_converting_length]

			if ( indexs_to_del.indexOf(f_converting_length) == -1 ) {
				new_arr.unshift(page_numb)
			}
		}

		self.pdf.f_converting = new_arr

	}

	self.add_foo_not_repeat = function (arr, value) {
		var index = arr.indexOf(value)

		if ( index === -1 ) {
			arr.push(value)
		}
	}

	self.ConstructorFunc()

	return self

}

module.exports = PDF2Images