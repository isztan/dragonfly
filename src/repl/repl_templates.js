﻿window.templates || (window.templates = {});

templates.repl_main = function()
{
  return [
    "div", [[
      ["div", [
         "ol", "class", "repl-lines js-source"
         ], "class", "repl-output"],
      ["div", [[
        ["span", ">>>\xA0", "class", "repl-prefix"],
        ["div", ["textarea",
                 "focus-handler", "repl-textarea",
                 "blur-handler", "blur-textarea",
                 "rows", "1"]]
      ]], "class", "repl-input"]
    ]], "class", "padding"
  ];
};

templates.repl_output_native = function(s, severity)
{
  return ["span", s, "class", "repl-native"];
};

templates.repl_output_native_or_pobj = function(thing, severity)
{
  if (thing.type == "native") {
    return templates.repl_output_native(thing.value, severity);
  }
  else
  {
    return templates.repl_output_pobj(thing);
  };
};

templates.repl_output_pobj = function(data)
{
  var is_element_type = settings.command_line.get("is-element-type-sensitive") && 
                        /(?:Element)$/.test(data.name)
  return [
    'code',
    data.friendly_printed ? this.friendly_print(data.friendly_printed) : data.name,
    'handler', is_element_type ? 'inspect-node-link' : 'inspect-object-link',
    'rt-id', data.rt_id.toString(),
    'obj-id', data.obj_id.toString(),
    'class', 'repl-pobj ' + (is_element_type ? 'inspect-node-link' : 'inspect-object-link')
  ];
};

templates.repl_output_traceentry = function(frame_list)
{
  var is_all_frames = frame_list.length <= ini.max_frames;
  var tpl = [];
  for (var i = 0, frame; frame = frame_list[i]; i++)
  {
    var function_name = is_all_frames && i == frame_list.length - 1
                      ? ui_strings.S_GLOBAL_SCOPE_NAME
                      : frame.objectValue.functionName || ui_strings.S_ANONYMOUS_FUNCTION_NAME;
    var uri = helpers.get_script_name(frame.scriptID);
    tpl.push(['div',
        ['span', function_name],
        ['span', (helpers.basename(uri) || '–') + ":" + (frame.lineNumber || '–'),
           'data-ref-id', "" + i,
           'data-script-id', String(frame.scriptID),
           'data-line-number', String(frame.lineNumber),
           'data-scope-variable-object-id', String(frame.variableObject),
           'data-this-object-id', String(frame.thisObject),
           'data-arguments-object-id', String(frame.argumentObject),
           'class', 'repl-output-go-to-source'
        ]
    ]);
  }
  return tpl;
};

templates.repl_output_trace = function(trace)
{
  var list = templates.repl_output_traceentry(trace.frameList);
  var tpl = ["div", list,
               "class", "console-trace",
               'handler', 'select-trace-frame',
               'runtime-id', trace.runtimeID.toString()
            ];
  return tpl;
};

templates.repl_group_line = function(group)
{
  return [["button", "class", "folder-key"+(group.collapsed ? "" : " open" ),
                     "handler", "repl-toggle-group", "group-id", group.id
          ], group.name];
};

templates.repl_output_location_link = function(id, line)
{
  var uri = helpers.get_script_name(id);
  if (!uri)
  {
    return [];
  }
  return ["span", helpers.basename(uri) + ":" + line,
            "class", "repl-output-go-to-source",
            "handler", "show-log-entry-source",
            "data-scriptid", String(id),
            "data-scriptline", String(line)
         ];
}
