/*

How to use:

1. Go to verb conjugate page in www.spanishdict.com e.g. http://www.spanishdict.com/conjugate/follar
2. Copy all code below in the web console
3. Call foo()

*/


function foo() {

    var verb = document.querySelectorAll('.source-text')[0].innerText

    var table = Array.from(document.querySelectorAll('.vtable'))[0]
    var rows = Array.from(table.querySelectorAll('tr'))

    var tenses = getValues(rows[0].children)

    var yo = getValues(rows[1].children)
    var tu = getValues(rows[2].children)
    var el = getValues(rows[3].children)
    var nos = getValues(rows[4].children)
    var vos = getValues(rows[5].children)
    var ell = getValues(rows[6].children)

    obj = []

    obj.push(JSONify(verb, tenses, yo))
    obj.push(JSONify(verb, tenses, tu))
    obj.push(JSONify(verb, tenses, el))
    obj.push(JSONify(verb, tenses, nos))
    obj.push(JSONify(verb, tenses, vos))
    obj.push(JSONify(verb, tenses, ell))

    console.log(JSON.stringify(obj))

}

function getValues(row) {

    values = []

    for (i = 0; i < row.length; i++) {

        values.push(row[i].innerText)

    }

    return values

}

function JSONify(verb, tenses, persona) {

    var connective = ": "
    var connective_2 = " - "
    var side_a_p1 = verb.concat(connective).concat(persona[0]).concat(connective_2)
    var side_a_p2 = ""
    var side_b = ""

    list = []

    for (i = 1; i < tenses.length; i++) {
        side_a_p2 = tenses[i]
        side_a = side_a_p1.concat(side_a_p2)
        side_b = persona[i]
        list.push({side_a, side_b})
    }

    return list

}

