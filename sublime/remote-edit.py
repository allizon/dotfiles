import sublime_plugin, os, re

class RemoteEdit(sublime_plugin.EventListener):
  def on_post_save(self, view):
    remote = {
      # "/Users/alholt/p4/projects/gcdn/components/mcdn-portal-2.13/akamai/mcdn-portal": "scp $1 root@172.26.112.151:/a/mcdnportal$2",
      # "/Users/alholt/p4/projects/gcdn/components/mcdn-portal-2.14/akamai/mcdn-portal": "scp $1 root@172.26.116.66:/a/mcdnportal$2",
      # "/Users/alholt/p4/projects/gcdn/components/mcdn-portal-2.14/akamai/mcdn-portal": "scp $1 root@172.26.116.8:/a/mcdnportal$2",
      # "/Users/alholt/p4/projects/gcdn/components/mcdn-portal-2.14/akamai/mcdn-portal/lib/ruby": "scp $1 root@172.26.116.8:/a/lib/mcdnportal/ruby$2",
      # "/Users/alholt/p4/projects/gcdn/components/mcdn-portal-2.14/akamai/mcdn-portal/hostsetup/schema.d/portal/upgrade.d": "scp $1 root@172.26.116.8:/a/mcdnportal/qa/upgrade.d$2",
      # "/Users/alholt/p4/projects/gcdn/components/mcdn-portal-2.14/akamai/mcdn-portal": "scp $1 alholt@bos-lp6ii:/home/alholt/p4/projects/gcdn/components/mcdn-portal-2.14/akamai/mcdn-portal$2",
      # "/Users/alholt/p4/projects/gcdn/components/mcdn-portal-3.0/akamai/mcdn-portal": "scp $1 root@172.26.116.200:/a/mcdnportal$2",
      # "/Users/alholt/p4/projects/gcdn/components/mcdn-portal-3.0/akamai/mcdn-portal/lib/ruby": "scp $1 root@172.26.116.200:/a/lib/mcdnportal/ruby$2",
      # "/Users/alholt/p4/mcdn-portal-3.1/akamai/mcdn-portal": "scp $1 lab:/a/mcdnportal$2",
      # "/Users/alholt/p4/mcdn-portal-3.2/akamai/mcdn-portal": "scp $1 lab:/a/mcdnportal$2",
      # "/Users/alholt/git/mcdn-portal-3.3": "scp $1 lab:/a/mcdnportal$2",
      # "/Users/alholt/git/mcdn-portal-3.4": "scp $1 lab:/a/mcdnportal$2",
      "/Users/alholt/git/mcdn-portal": "scp $1 lab:/a/mcdnportal$2",
      "/Users/alholt/p4/ruby/mcdn-rails": "scp $1 alholt@bos-lp6ii:/www/mcdn-rails$2",
      # "/Users/alholt/activ8/activ8": "scp $1 ajholt@allenholt.com:/home/ajholt/webapps/activ8/activ8$2",
      # "/Users/alholt/mg6": "scp $1 ajholt@allenholt.com:/home/ajholt/mg6$2",
      # "/Users/alholt/sites/django": "scp $1 ajholt@allenholt.com:/home/ajholt/webapps/django$2",
      "/Users/alholt/sites/activ8": "scp $1 ajholt@allenholt.com:/home/ajholt/webapps/mustang/wp-content/themes/easel$2" }

    for dirname, target in remote.items():
      if view.file_name().startswith( dirname ):
        print("------------------------------------")
        target = target.replace( "$1", view.file_name() )
        target = target.replace( "$2", view.file_name()[len(dirname):] )
        target = target.replace( "\\", "/" );

        # We don't need to copy up .scss files, but the resulting .css files
        if dirname.startswith( '/Users/alholt/p4/projects/gcdn/components/mcdn-portal-2' ):
          scss_matches = re.search( 'scss', target )
          if None != scss_matches:
            target = target.replace( 'sass/', '' )
            target = target.replace( 'scss', 'css' )

        print("target: " + target)
        os.system( target + " &" )
