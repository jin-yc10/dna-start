__author__ = 'jin-yc10'

import tornado.web

class WorkHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("site/work.html")
