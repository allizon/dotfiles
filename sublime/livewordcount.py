import sublime, sublimeplugin, re

class liveWordCount(sublimeplugin.Plugin):
   def onModified(self, view):
      sels = view.sel()
      content = view.substr(sublime.Region(0, view.size()))
      sublime.statusMessage("Words: %s" % self.count(content))

   def count(self, content):
      """counts by counting all the start-of-word characters"""

      # regex to find word characters
      wrdRx = re.compile("\w")
      matchingWrd = False
      words = 0;
      for ch in content:
         # test if this char is a word char
         isWrd = wrdRx.match(ch) != None

         if isWrd and not matchingWrd:
            # we're moving into a word from not-a-word
            words = words + 1
            matchingWrd = True
         if not isWrd:
            # go back to not matching words
            matchingWrd = False
      return words