/* 670 */\n (function(module, exports, __webpack_require__) {\n!function(n,i){ true?module.exports=i():undefined}(this,function(){\"use strict\";return[{locale:\"ga\",pluralRuleFunction:function(n,i){var e=String(n).split(\".\"),a=Number(e[0])==n;return i?1==n?\"one\":\"other\":1==n?\"one\":2==n?\"two\":a&&n>=3&&n<=6?\"few\":a&&n>=7&&n<=10?\"many\":\"other\"},fields:{year:{displayName:\"Bliain\",relative:{0:\"an bhliain seo\",1:\"an bhliain seo chugainn\",\"-1\":\"anuraidh\"},relativeTime:{future:{one:\"i gceann {0} bhliain\",two:\"i gceann {0} bhliain\",few:\"i gceann {0} bliana\",many:\"i gceann {0} mbliana\",other:\"i gceann {0} bliain\"},past:{one:\"{0} bhliain ó shin\",two:\"{0} bhliain ó shin\",few:\"{0} bliana ó shin\",many:\"{0} mbliana ó shin\",other:\"{0} bliain ó shin\"}}},\"year-short\":{displayName:\"bl.\",relative:{0:\"an bhl. seo\",1:\"an bhl. seo chugainn\",\"-1\":\"anuraidh\"},relativeTime:{future:{one:\"i gceann {0} bl.\",two:\"i gceann {0} bhl.\",few:\"i gceann {0} bl.\",many:\"i gceann {0} mbl.\",other:\"i gceann {0} bl.\"},past:{one:\"{0} bhl. ó shin\",two:\"{0} bhl. ó shin\",few:\"{0} bl. ó shin\",many:\"{0} mbl. ó shin\",other:\"{0} bl. ó shin\"}}},month:{displayName:\"Mí\",relative:{0:\"an mhí seo\",1:\"an mhí seo chugainn\",\"-1\":\"an mhí seo caite\"},relativeTime:{future:{one:\"i gceann {0} mhí\",two:\"i gceann {0} mhí\",few:\"i gceann {0} mhí\",many:\"i gceann {0} mí\",other:\"i gceann {0} mí\"},past:{one:\"{0} mhí ó shin\",two:\"{0} mhí ó shin\",few:\"{0} mhí ó shin\",many:\"{0} mí ó shin\",other:\"{0} mí ó shin\"}}},\"month-short\":{displayName:\"mí\",relative:{0:\"an mhí seo\",1:\"an mhí seo chugainn\",\"-1\":\"an mhí seo caite\"},relativeTime:{future:{one:\"i gceann {0} mhí\",two:\"i gceann {0} mhí\",few:\"i gceann {0} mhí\",many:\"i gceann {0} mí\",other:\"i gceann {0} mí\"},past:{one:\"{0} mhí ó shin\",two:\"{0} mhí ó shin\",few:\"{0} mhí ó shin\",many:\"{0} mí ó shin\",other:\"{0} mí ó shin\"}}},day:{displayName:\"Lá\",relative:{0:\"inniu\",1:\"amárach\",2:\"arú amárach\",\"-2\":\"arú inné\",\"-1\":\"inné\"},relativeTime:{future:{one:\"i gceann {0} lá\",two:\"i gceann {0} lá\",few:\"i gceann {0} lá\",many:\"i gceann {0} lá\",other:\"i gceann {0} lá\"},past:{one:\"{0} lá ó shin\",two:\"{0} lá ó shin\",few:\"{0} lá ó shin\",many:\"{0} lá ó shin\",other:\"{0} lá ó shin\"}}},\"day-short\":{displayName:\"Lá\",relative:{0:\"inniu\",1:\"amárach\",2:\"arú amárach\",\"-2\":\"arú inné\",\"-1\":\"inné\"},relativeTime:{future:{one:\"i gceann {0} lá\",two:\"i gceann {0} lá\",few:\"i gceann {0} lá\",many:\"i gceann {0} lá\",other:\"i gceann {0} lá\"},past:{one:\"{0} lá ó shin\",two:\"{0} lá ó shin\",few:\"{0} lá ó shin\",many:\"{0} lá ó shin\",other:\"{0} lá ó shin\"}}},hour:{displayName:\"Uair\",relative:{0:\"an uair seo\"},relativeTime:{future:{one:\"i gceann {0} uair an chloig\",two:\"i gceann {0} uair an chloig\",few:\"i gceann {0} huaire an chloig\",many:\"i gceann {0} n-uaire an chloig\",other:\"i gceann {0} uair an chloig\"},past:{one:\"{0} uair an chloig ó shin\",two:\"{0} uair an chloig ó shin\",few:\"{0} huaire an chloig ó shin\",many:\"{0} n-uaire an chloig ó shin\",other:\"{0} uair an chloig ó shin\"}}},\"hour-short\":{displayName:\"uair\",relative:{0:\"an uair seo\"},relativeTime:{future:{one:\"i gceann {0} uair\",two:\"i gceann {0} uair\",few:\"i gceann {0} huaire\",many:\"i gceann {0} n-uaire\",other:\"i gceann {0} uair\"},past:{one:\"{0} uair ó shin\",two:\"{0} uair ó shin\",few:\"{0} huaire ó shin\",many:\"{0} n-uaire ó shin\",other:\"{0} uair ó shin\"}}},minute:{displayName:\"Nóiméad\",relative:{0:\"an nóiméad seo\"},relativeTime:{future:{one:\"i gceann {0} nóiméad\",two:\"i gceann {0} nóiméad\",few:\"i gceann {0} nóiméad\",many:\"i gceann {0} nóiméad\",other:\"i gceann {0} nóiméad\"},past:{one:\"{0} nóiméad ó shin\",two:\"{0} nóiméad ó shin\",few:\"{0} nóiméad ó shin\",many:\"{0} nóiméad ó shin\",other:\"{0} nóiméad ó shin\"}}},\"minute-short\":{displayName:\"nóim.\",relative:{0:\"an nóiméad seo\"},relativeTime:{future:{one:\"i gceann {0} nóim.\",two:\"i gceann {0} nóim.\",few:\"i gceann {0} nóim.\",many:\"i gceann {0} nóim.\",other:\"i gceann {0} nóim.\"},past:{one:\"{0} nóim. ó shin\",two:\"{0} nóim. ó shin\",few:\"{0} nóim. ó shin\",many:\"{0} nóim. ó shin\",other:\"{0} nóim. ó shin\"}}},second:{displayName:\"Soicind\",relative:{0:\"anois\"},relativeTime:{future:{one:\"i gceann {0} soicind\",two:\"i gceann {0} shoicind\",few:\"i gceann {0} shoicind\",many:\"i gceann {0} soicind\",other:\"i gceann {0} soicind\"},past:{one:\"{0} soicind ó shin\",two:\"{0} shoicind ó shin\",few:\"{0} shoicind ó shin\",many:\"{0} soicind ó shin\",other:\"{0} soicind ó shin\"}}},\"second-short\":{displayName:\"soic.\",relative:{0:\"anois\"},relativeTime:{future:{one:\"i gceann {0} soic.\",two:\"i gceann {0} shoic.\",few:\"i gceann {0} shoic.\",many:\"i gceann {0} soic.\",other:\"i gceann {0} soic.\"},past:{one:\"{0} soic. ó shin\",two:\"{0} shoic. ó shin\",few:\"{0} shoic. ó shin\",many:\"{0} soic. ó shin\",other:\"{0} soic. ó shin\"}}}}}]});\n })