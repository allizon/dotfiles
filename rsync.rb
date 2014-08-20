#!/Users/alholt/.rbenv/shims/ruby
# rsync Ruby script
require 'optparse'

options = { }

OptionParser.new do |opts|
  opts.on('-f', "Force update of all files (don\'t check timestamps)") do
    options[:force] = true
  end

  opts.on('-d', 'Delete existing extraneous files at destination') do
    options[:delete_at_dest] = true
  end

  opts.on('-n', 'Dry run') do
    options[:dry_run] = true
  end
end.parse!

def v3
  {
    name: 'Portal v3.0',
    dir: '/Users/alholt/p4/projects/gcdn/components/mcdn-portal-3.0/akamai/mcdn-portal/',
    src: 'app scripts config db',
    dst: 'root@172.26.116.200:/a/mcdnportal/',
    exc: [
      '*.swp',
      'config/https/rails.conf',
      'app/assets/javascripts/node_modules'
    ],
  }
end

def v34
  {
    name: 'Portal v3.4',
    dir: '/Users/alholt/git/mcdn-portal-3.4/',
    src: 'app scripts config db',
    dst: 'root@198.18.61.191:/a/mcdnportal/',
    exc: [
      '*.swp',
      'config/https/rails.conf'
    ]
  }
end

def v33
  {
    name: 'Portal v3.3',
    dir: '/Users/alholt/git/mcdn-portal-3.3/',
    src: 'app scripts config db',
    dst: 'lab:/a/mcdnportal/',
    exc: [
      '*.swp',
      'config/https/rails.conf'
    ]
  }
end

def v32
  {
    name: 'Portal v3.2',
    # dir: '/Users/alholt/p4/mcdn-portal-3.2/akamai/mcdn-portal/',
    dir: '/Users/alholt/git/mcdn-portal-3.2/',
    src: 'app scripts config db',
    dst: 'lab:/a/mcdnportal/',
    exc: [
      '*.swp',
      'config/https/rails.conf',
      'app/assets/javascripts/node_modules'
    ],
    post: [
      `ssh lab chown -R akamai:akamai /a/mcdnportal`
    ]
  }
end

def vgraphs
  {
    name: 'Portal v3.0 (bos-lp6ii)',
    dir: '/Users/alholt/p4/mcdn-portal-graphs/akamai/mcdn-portal/',
    src: 'app scripts config db',
    dst: 'root@172.26.116.200:/a/mcdnportal/',
    exc: [
      '*.swp',
      'config/https/rails.conf'
    ]
  }
end

def mg6
  {
    name: 'Moviegeekz (DEV)',
    dir: '/Users/alholt/mg6/',
    src: '',
    dst: 'ajholt@allenholt.com:/home/ajholt/dev_mg6/',
    exc: [
      'js/node_modules',
      'library'
    ]
  }
end

def site
  {
    name: 'Site',
    dir: '/Users/alholt/git/site/',
    src: 'build',
    dst: 'ajholt@allenholt.com:/home/ajholt/webapps/site/',
    exc: [
      # 'js/node_modules',
      # 'library'
    ]
  }
end

def start
  {
    name: 'Start',
    dir: '/Users/alholt/git/start/',
    src: 'build/*',
    dst: 'ajholt@allenholt.com:/home/ajholt/webapps/start/',
    exc: [
      # 'js/node_modules',
      # 'library'
    ]
  }
end

def paths
  [
    [ 'mcdn-portal-3.2',    v32 ],
    [ 'mcdn-portal-3.3',    v33 ],
    [ 'mcdn-portal-3.4',    v34 ],
    [ 'mcdn-portal-graphs', vgraphs ],
    [ 'mg6',                mg6 ],
    [ 'site',               site ],
    [ 'start',              start ],
  ]
end

# Need a bit more of a failsafe in here -- currently tries to
# work when it's in home or p4
map = false
paths.each do |o|
	map = o.last if Dir.getwd.match o.first
end

# Must be in one of our syncable directories - this could probably
# use more than a bit of love.
unless map
	puts "Not in a syncable directory, sorry."
	exit
end

puts "Syncing project: #{map[:name]}"
Dir.chdir map[:dir].to_s

opts = ''
map[:exc].each { |f| opts << ' --exclude ' + f }
opts << ' -vrp'

opts << 'u' unless options[:force]
opts << 'n' if options[:dry_run]
opts << ' --del' if options[:delete_at_dest]

puts "Running: rsync #{opts} #{map[:src]} #{map[:dst]}"
puts `rsync #{opts} #{map[:src]} #{map[:dst]}`
map[:post].each { |p| puts p } unless map[:post].nil?


