
def f(**kwargs):
    return reduce(lambda x,y: x+y, kwargs.iterkeys(), "")

print f(org="mettl", test = "python")