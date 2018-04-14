def fileNameAsClass(snip):
  # components = snip.basename.decode('utf-8').split('_')
  components = snip.basename.split('_')
  return ''.join(map(str.capitalize, components))
