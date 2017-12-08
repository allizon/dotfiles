import string

def fileNameAsClass(snip):
  components = snip.basename.decode('utf-8').split('_')
  return ''.join(map(string.capitalize, components))
