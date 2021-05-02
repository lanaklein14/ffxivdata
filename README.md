# data更新

## DCやWorld変更

1. /data/datacenters.json を更新
2. > npm run xivapi

## エリアやMOBの情報変更

1. /data/zones.json に追加エリアの情報を追記
2. /data/regions.json に追加エリアの情報を追記
3. > npm run build
4. > npm run xivapi

## エリアインスタンス数変更

1. /dist/zoneinstances.json を直接編集

# xivapi.com の使い方

World 情報を取得する。

## モブ名の検索
https://xivapi.com/search?indexes=BNpcName&string_column=Name_ja&string=イシュタム
→2つヒット。一つは死者の宮殿の同名モンスター
当たりを付けたら、付近のモブを表示
https://xivapi.com/BNpcName?columns=ID,Name_ja,Name_en,Name_fr,Name_de&page=89

## エリアの検索
まず、名前でPlaceNameに当たりを付ける
https://xivapi.com/search?indexes=PlaceName&string=Tempest
https://xivapi.com/search?indexes=PlaceName&string_column=Name_ja&string=テンペスト
→/PlaceName/2958 あたりに固まっていると分かる
    {
      "ID": 2958,
      "Icon": "/c/PlaceName.png",
      "Name": "The Tempest",
      "Url": "/PlaceName/2958",
      "UrlType": "PlaceName",
      "_": "placename",
      "_Score": 1
    }
いろいろ情報取れる。
地図 Maps.MapFileName = https://xivapi.com/m/n4f6/n4f6.00.jpg
PlaceNameRegion 2950
PlaceNameZone 518
