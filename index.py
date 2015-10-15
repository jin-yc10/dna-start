__author__ = 'jin-yc10'

import tornado.ioloop
import tornado.web
import tornado.options
from tornado.options import define, options
from work import WorkHandler

settings = {'debug': True}

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("site/index.html")

class BasicTestHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("site/basic_test.html")

class ThreeHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("three_site/index.html")

class BackboneHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("three_site/backbone.html")

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/work", WorkHandler),
    (r"/basic_test", BasicTestHandler),
    (r"/lib/(.*)", tornado.web.StaticFileHandler, {"path": "site/lib"}),
    (r"/three", ThreeHandler),
    (r"/backbone", BackboneHandler),
    (r"/three/lib/(.*)", tornado.web.StaticFileHandler, {"path": "three_site/lib/"}),
    (r"/three/img/(.*)", tornado.web.StaticFileHandler, {"path": "three_site/img/"}),
    (r"/three/js/(.*)", tornado.web.StaticFileHandler, {"path": "three_site/js/"}),
    (r"/three/css/(.*)", tornado.web.StaticFileHandler, {"path": "three_site/css/"}),
], **settings)

if __name__ == "__main__":
    application.listen(8080)
    tornado.options.options.logging = "debug"
    tornado.ioloop.IOLoop.current().start()