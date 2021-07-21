#sring input
sh = input('Enter Hours:')
sr = input('Enter Rate:')
#converting string to float
fh = float(sh)
fr = float(sr)
# print(fh, fr)
if fh > 40 :
    # print("Overtime")
    regular = fh * fr
    overtime = (fh - 40) * (fr * 0.5)
    # print(reg,otp)
    pay = regular + overtime
else:
    # print("Regular")
    pay = fh * fr
print(pay)
