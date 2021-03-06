/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
 YUI().use('mojito-util', 'test', 'array-extras', function(Y) {

    var suite = new Y.Test.Suite('util tests'),
        cases = {},
        A = Y.Assert,
        AA = Y.ArrayAssert,
        OA = Y.ObjectAssert;

    cases = {
        name: 'functional',

        'blend should work on arrays': function() {
            var base = [0, 1, 2, 3],
                over = ['a', 'b'];

            AA.itemsAreEqual([0, 1, 2, 3, 'a', 'b'],
                Y.mojito.util.blend(base, over),
                     'Array values should properly blend.');
        },
        
        'blend should unique arrays': function() {
            var base = [0, 1, 2, 3],
                over = ['a', 'b', 1];

            AA.itemsAreEqual([0, 1, 2, 3, 'a', 'b'],
                Y.mojito.util.blend(base, over),
                     'Array values should blend uniquely.');
        },
        
        'blend should work on objects': function() {
            var base = {
                    a: 1,
                    b: 2
                },
                over = {
                    c: 3,
                    d: 4
                },
                blended = {
                    a: 1,
                    b: 2,
                    c: 3,
                    d: 4
                };

            OA.areEqual(blended, Y.mojito.util.blend(base, over));
        },

        'blend should replace object values': function() {
            var base = {
                    a: 1,
                    b: 2
                },
                over = {
                    c: 3,
                    a: 4
                },
                blended = {
                    a: 4,
                    b: 2,
                    c: 3
                };

            OA.areEqual(blended, Y.mojito.util.blend(base, over));
        },
        
        'blend should handle nested merges': function() {
            var base = {
                    a: 1,
                    b: 2,
                    c: {
                        foo: 1
                    }
                },
                over = {
                    c: {
                        bar: 2
                    }
                },
                blended = {
                    a: 1,
                    b: 2,
                    c: {
                        foo: 1,
                        bar: 2
                    }
                };

            OA.areEqual(blended.c, Y.mojito.util.blend(base, over).c);
        },

        'blend should handle nested merges with replacements': function() {
            var base = {
                    a: 1,
                    b: 2,
                    c: {
                        foo: 1,
                        baz: 3
                    }
                },
                over = {
                    a: 4,
                    c: {
                        foo: 3,
                        bar: 2
                    }
                },
                blended = {
                    a: 4,
                    b: 2,
                    c: {
                        foo: 3,
                        bar: 2,
                        baz: 3
                    }
                };

            OA.areEqual(blended.c, Y.mojito.util.blend(base, over).c);
        },

        'cleanse should utf encode big 5 chars': function() {
            A.areSame(
                'test \\u003Cscript\\u003Ealert(\\u0022hi, i\\u0027m a squid \\u0026 a happy one!\\u0022)\\u003C/script\\u003E',
                Y.mojito.util.cleanse(
                    'test <script>alert("hi, i\'m a squid & a happy one!")</script>'));
        },

        'cleanse should accept an empty array': function() {
            var a = [];
            AA.itemsAreEqual(a, Y.mojito.util.cleanse(a),
                'test Empty array should cleanse properly as empty array.');
        },

        'cleanse should accept nested empty arrays': function() {
            var a = [[]];
            // AA.itemsAreEqual is brain-damaged and doesn't maintain Array
            // semantics for content checks so we hack around it with JSON.
            A.areSame(Y.JSON.stringify(a),
                Y.JSON.stringify(Y.mojito.util.cleanse(a)),
                'test Array with single (empty) array child should cleanse properly.');
        },

        'should cleanse an array of strings': function() {
            var a1,
                a2;

            a1 = ['<script>I\'m a hack attempt</script>'];
            a2 = ['\\u003Cscript\\u003EI\\u0027m a hack attempt\\u003C/script\\u003E'];
            AA.itemsAreEqual(a2, Y.mojito.util.cleanse(a1),
                'test array cleanse should work');
        },

        'test cleanse cleanses an object': function() {
            var o1,
                o2;

            o1 = {'key': '<script>I\'m a hack attempt</script>'};
            o2 = {'key':
                '\\u003Cscript\\u003EI\\u0027m a hack attempt\\u003C/script\\u003E'};

            OA.areEqual(o2, Y.mojito.util.cleanse(o1));
        },

        'test cleanse cleanses a nested array': function() {
            var a1,
                a2;

            a1 = [['<script>I\'m a hack attempt</script>']];
            a2 = [['\\u003Cscript\\u003EI\\u0027m a hack attempt\\u003C/script\\u003E']];
            AA.itemsAreEqual(a2[0], Y.mojito.util.cleanse(a1)[0]);
        },

        'test cleanse cleanses a nested object': function() {
            var a1,
                a2;

            a1 = [{'key': '<script>I\'m a hack attempt</script>'}];
            a2 = [{'key':
                '\\u003Cscript\\u003EI\\u0027m a hack attempt\\u003C/script\\u003E'}];

            OA.areEqual(a2[0], Y.mojito.util.cleanse(a1)[0],
                'test object cleanse should work');
        },

        'test cleanse ignores numbers, booleans, etc.': function() {
            var a1,
                a2;

            a1 = [1, true, 'blah'];
            a2 = [1, true, 'blah'];

            AA.itemsAreEqual(a2, Y.mojito.util.cleanse(a1));
        },

        'test unicodeToHtmlEntities uncleanses a string': function() {
            A.areSame(
                '<script>alert("hi, i\'m a squid & a happy one!")</script>',
                Y.mojito.util.cleanse(
                    '\\u003Cscript\\u003Ealert(\\u0022hi, i\\u0027m a squid \\u0026 a happy one!\\u0022)\\u003C/script\\u003E',
                    Y.mojito.util.unicodeToHtmlEntities));
        },

        'test uncleanse uncleanses a string': function() {
            A.areSame(
                '<script>alert("hi, i\'m a squid & a happy one!")</script>',
                Y.mojito.util.uncleanse(
                    '\\u003Cscript\\u003Ealert(\\u0022hi, i\\u0027m a squid \\u0026 a happy one!\\u0022)\\u003C/script\\u003E'));
        },

        'test uncleanse uncleanses an empty array': function() {
            var a = [];
            AA.itemsAreEqual(a, Y.mojito.util.uncleanse(a),
                'Empty array should cleanse properly as empty array.');
        },

        'test uncleanse cleanses an array with single array child': function() {
            var a = [[]];
            // AA.itemsAreEqual is brain-damaged and doesn't maintain Array
            // semantics for content checks so we hack around it with JSON.
            A.areSame(Y.JSON.stringify(a),
                Y.JSON.stringify(Y.mojito.util.uncleanse(a)),
                'Array with single (empty) array child should uncleanse properly.');
        },

        'test uncleanse uncleanses an array': function() {
            var a1,
                a2;

            a1 = ['<script>I\'m a hack attempt</script>'];
            a2 = ['\\u003Cscript\\u003EI\\u0027m a hack attempt\\u003C/script\\u003E'];
            AA.itemsAreEqual(a1, Y.mojito.util.uncleanse(a2),
                'array uncleanse should work');
        },

        'test uncleanse uncleanses an object': function() {
            var o1,
                o2;

            o1 = {'key': '<script>I\'m a hack attempt</script>'};
            o2 = {'key':
                '\\u003Cscript\\u003EI\\u0027m a hack attempt\\u003C/script\\u003E'};

            OA.areEqual(o1, Y.mojito.util.uncleanse(o2),
                'object uncleanse should work');
        },

        'test uncleanse uncleanses a nested array': function() {
            var a1,
                a2;

            a1 = [['<script>I\'m a hack attempt</script>']];
            a2 = [['\\u003Cscript\\u003EI\\u0027m a hack attempt\\u003C/script\\u003E']];
            AA.itemsAreEqual(a1[0], Y.mojito.util.uncleanse(a2)[0],
                'nested array uncleanse should work');
        },

        'test uncleanse uncleanses a nested object': function() {
            var a1,
                a2;

            a1 = [{'key': '<script>I\'m a hack attempt</script>'}];
            a2 = [{'key':
                '\\u003Cscript\\u003EI\\u0027m a hack attempt\\u003C/script\\u003E'}];

            OA.areEqual(a1[0], Y.mojito.util.uncleanse(a2)[0],
                'object uncleanse should work');
        },

        'test copy() deep copies an object': function() {
            var obj = {
                    inner: {
                        string: "value",
                        number: 1,
                        fn: function() {}
                    }
                },
                copy = Y.mojito.util.copy(obj);

            A.areNotSame(obj, copy);

            A.areNotSame(obj.inner, copy.inner);
            OA.areEqual(obj.inner, copy.inner);

            A.areSame(obj.inner.string, copy.inner.string);
            A.areSame(obj.inner.number, copy.inner.number);
            A.areSame(obj.inner.fn, copy.inner.fn);
        },

        'test metaMerge empty to empty': function() {
            var to = {};
            var from = {};
            var result = Y.mojito.util.metaMerge(to, from);
            OA.areEqual({}, result, "result should be empty");
        },

        'test metaMerge full to empty': function() {
            var to = {};
            var from = {
                stuff: 'here'
            };
            var result = Y.mojito.util.metaMerge(to, from);
            OA.areEqual(from, result);
        },

        'test metaMerge empty to full': function() {
            var to = {
                stuff: 'here'
            };
            var from = {};
            var result = Y.mojito.util.metaMerge(to, from);
            OA.areEqual(to, result);
        },

        'test metaMerge copies objects': function() {
            var to = {};
            var from = {
                obj: {hello: 'world'}
            };
            var result = Y.mojito.util.metaMerge(to, from);
            OA.areEqual(from, result);
        },

        'test metaMerge copies arrays': function() {
            var to = {};
            var from = {
                arr: ['hello', 'world']
            };
            var result = Y.mojito.util.metaMerge(to, from);
            OA.areEqual(from, result, "result should be same as from");
            AA.itemsAreEqual(from.arr, result.arr,
                "result array items should equal from array items");
        },

        'test metaMerge copies "from" properties into "to" objects': function() {
            var to = {
                a: { one: 1 }
            };
            var from = {
                a: { two: 2 }
            };
            var expected = {
                a: { one: 1, two: 2 }
            };
            var result = Y.mojito.util.metaMerge(to, from);
            OA.areEqual(expected.a, result.a,
                "result should have objects merged");
        },

        'test metaMerge copies "from" properties into "to" objects (DEEP)': function() {
            var to = {
                a: {
                    b: {
                        one: 1
                    }
                }
            };
            var from = {
                a: {
                    b: {
                        two: 2
                    },
                    c: 'hello'
                }
            };
            var expected = {
                a: {
                    b: {
                        one: 1,
                        two: 2
                    },
                    c: 'hello'
                }
            };
            var result = Y.mojito.util.metaMerge(to, from);
            OA.areEqual(expected.a.b, result.a.b, "result should have objects merged (a.b)");
            A.areSame(expected.a.c, result.a.c, "result should have objects merged (a.c)");
        },

        'test metaMerge does not overwrite "from" properties into "to" objects (DEEP)': function() {
            var to = {
                a: {
                    b: 'hello'
                }
            };
            var from = {
                a: {
                    b: 'goodbye'
                }
            };
            var expected = {
                a: {
                    b: 'hello'
                }
            };
            var result = Y.mojito.util.metaMerge(to, from);
            A.areEqual(expected.a.b, result.a.b, "result should have objects merged (a.b)");
        },

        'test metaMerge adds elements to existing arrays': function() {
            var to = {
                arr: [1, 2, 3]
            };
            var from = {
                arr: ['hello', 'world']
            };
            var expected = {
                arr: [1,2,3,'hello', 'world']
            };
            var result = Y.mojito.util.metaMerge(to, from);
            AA.itemsAreEqual(expected.arr, result.arr,
                "result array should have added elements");
        },

        'test metaMerge uniques arrays': function() {
            var to = {
                arr: [1, 2, 3, 'hello']
            };
            var from = {
                arr: ['hello', 'world']
            };
            var expected = {
                arr: [1,2,3,'hello', 'world']
            };
            var result = Y.mojito.util.metaMerge(to, from);
            AA.itemsAreEqual(expected.arr, result.arr,
                "result array should have merged and uniqued array elements");
        },

        'test metaMerge uniques nested arrays': function() {
            var to = {
                arrContainer: {
                    arr: [1, 2, 3, 'hello']
                }
            };
            var from = {
                arrContainer: {
                    arr: ['hello', 'world']
                }
            };
            var expected = {
                arrContainer: {
                    arr: [1,2,3,'hello', 'world']
                }
            };
            var result = Y.mojito.util.metaMerge(to, from);
            AA.itemsAreEqual(expected.arrContainer.arr, result.arrContainer.arr,
                "result array should have merged and uniqued nested array elements");
        },

        'test metaMerge overwrites content-type values': function() {
            var to = {
                'content-type': ['foo']
            };
            var from = {
                'content-type': ['bar']
            };
            var expected = {
                'content-type': ['bar']
            };
            var result = Y.mojito.util.metaMerge(to, from);
            AA.itemsAreEqual(expected['content-type'], result['content-type'], "result array should have been overridden");
        },

        'test metaMerge only uses the last content-type value': function() {
            var to = {
                'content-type': ['foo']
            };
            var from = {
                'content-type': ['bar', 'baz']
            };
            var expected = {
                'content-type': ['baz']
            };
            var result = Y.mojito.util.metaMerge(to, from);
            OA.areEqual(expected['content-type'], result['content-type'], "result array should only have last content-type value");
        },

        'test metaMerge does not merge view data': function() {
            var to = {
                view: 'foo'
            };
            var from = {
                view: 'bar'
            };
            var expected = {
                view: 'foo'
            };
            var result = Y.mojito.util.metaMerge(to, from);
            A.areSame(expected.view, result.view, "meta view data should be retained");
        },

        // is util.array.remove() dead code? no contructor but this.push.apply()

        'test util.array.contains() lcov': function() {
            var arr = [1,2,3,4,5,6];
            A.isTrue(Y.mojito.util.array.contains(arr, 5));
            A.isFalse(Y.mojito.util.array.contains(arr, '5'));
            A.isFalse(Y.mojito.util.array.contains(arr, 'yo mama'));
        },

        'ignore: metaMerge copies objects lower cases all keys': function() {
            var to = {};
            var from = {
                OBJ: {hello: 'world'}
            };
            var expected = {
                obj: {hello: 'world'}
            };
            var result = Y.mojito.util.metaMerge(to, from);
            A.areSame(expected.obj.hello, result.obj.hello, "result should have lower-cased all keys");
        },

        'ignore: test metaMerge DOES NOT sees content-type as case insensitive': function() {
            var to = {
                'Content-Type': ['foo']
            };
            var from = {
                'content-TYPE': ['bar', 'baz']
            };
            var expected = {
                'content-type': ['baz']
            };
            var result = Y.mojito.util.metaMerge(to, from);
            OA.areEqual(expected['content-type'], result['content-type']);
        },

        'test findClosestLang': function() {
            var have = {
                'en-US': true,
                'en': true,
                'de': true,
            };
            A.areSame('en-US', Y.mojito.util.findClosestLang('en-US-midwest', have), 'en-US-midwest');
            A.areSame('en-US', Y.mojito.util.findClosestLang('en-US', have), 'en-US');
            A.areSame('en', Y.mojito.util.findClosestLang('en', have), 'en');
            A.areSame('de', Y.mojito.util.findClosestLang('de-DE', have), 'de-DE');
            A.areSame('de', Y.mojito.util.findClosestLang('de', have), 'de');
            A.areSame('', Y.mojito.util.findClosestLang('nl-NL', have), 'nl-NL');
            A.areSame('', Y.mojito.util.findClosestLang('nl', have), 'nl');
            A.areSame('', Y.mojito.util.findClosestLang('', have), 'no lang');
        }

    };

    suite.add(new Y.Test.Case(cases));
    Y.Test.Runner.add(suite);
});
