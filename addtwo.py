def addtwo(a, b):
    added = a + b
    return added

x = addtwo(19294897, 564783686)
print(x)

def thing():
    print('Hello')

print('Hello')

def func(x):
    print(x)

func(10)
func(20)

def stuff():
    print('Hello')
    return
    print('World')

stuff()

def greet(lang):
    if lang == 'es':
        return 'Hola'

    elif lang == 'fr':
        return 'Bonjour'
    else:
        return 'Hello'

print(greet('fr'), 'Michael')
