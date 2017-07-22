require 'editor_config'
filename = "~/Public/editorconfig-test/test.ruby"
config = EditorConfig.load_file(filename)
  print(config)
