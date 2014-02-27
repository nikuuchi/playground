#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os
import time
import commands
import codecs
import json
import yaml
from pymongo import MongoClient

def CreateResponseJson(source, result, error):
    return json.dumps({'source': source, 'result': result, 'error': error})

def CreateSourceFile(name, contents):
    f = codecs.open(name, 'w', 'utf-8')
    f.write(contents)
    f.close()

def Compile(name):
    #TODO
    return commands.getoutput('java -jar /usr/local/bin/libzen.jar -l erlang ' + name + ' > ' + name + '.txt')


if __name__ == '__main__':
    print "Content-Type: application/json"
    print ""

    if os.environ['REQUEST_METHOD'] != "POST":
        print '{\'error\':No Method Error\' }'
        sys.exit()

    name = commands.getoutput("/bin/mktemp -q /tmp/XXXXXX.zen")
    req = json.load(sys.stdin)

    CreateSourceFile(name, req["source"])
    message = Compile(name)

    jsfilecontent = ''
    compile_flag = os.path.exists(name+".txt")
    if compile_flag:
        a = open(name+'.txt', 'r')
        jsfilecontent = a.read()

    print CreateResponseJson(jsfilecontent, '', message)
