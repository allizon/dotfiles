import sublime, sublimeplugin

class I18n( sublimeplugin.TextCommand ):
	def run( self, view, args ):
		for region in view.sel( ):
			print view.substr( region )