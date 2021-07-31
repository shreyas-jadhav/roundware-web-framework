"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortRandomly = sortRandomly;
exports.sortByWeight = sortByWeight;
exports.sortByLikes = sortByLikes;
exports.sortByProjectDefault = sortByProjectDefault;

// see https://github.com/loafofpiecrust/roundware-ios-framework-v2/blob/client-mixing/RWFramework/RWFramework/Playlist/SortMethod.swift

/**
 Sort assets destructively, in random order.
 @note This is tricky to get right, uses a Fisher-Yates (aka Knuth) Shuffle. I copied this right out of Stack Overflow.
 @see https://stackoverflow.com/a/2450976/308448
 @see http://sedition.com/perl/javascript-fy.html
 */
function sortRandomly(assetsArray) {
  for (var i = assetsArray.length - 1; i > 0; i--) {
    var rand = Math.floor(Math.random() * (i + 1));
    var _ref = [assetsArray[rand], assetsArray[i]];
    assetsArray[i] = _ref[0];
    assetsArray[rand] = _ref[1];
  }
}
/**
 Sort assets destructively, in descending order of assigned weight.
 */


function sortByWeight(assetsArray) {
  assetsArray.sort(function (assetA, assetB) {
    return assetA.weight - assetB.weight;
  });
}
/**
Sort assets destructively, in descending order of current number of likes.
@TODO Not implemented yet
*/


function sortByLikes(assetsArray) {
  // eslint-disable-line no-unused-vars
  console.warn("sortByLikes not implemented yet"); // TODO: implement sortByLikes
}

function sortByProjectDefault(ordering) {
  switch (ordering) {
    case "by_weight":
      return sortByWeight;

    case "by_like":
      return sortByLikes;

    case "random":
    default:
      return sortRandomly;
  }
} // swift code for 'sortByRanking':
//private var assetVotes: [Int: Int]? = nil
//func sortRanking(for asset: Asset, in playlist: Playlist) -> Double {
//if let votes = assetVotes?[asset.id] {
//return Double(-votes)
//} else {
//return 0.0
//}
//}
//func onRefreshAssets(in playlist: Playlist) -> Promise<Void> {
//let projectId = playlist.project.id
//return RWFramework.sharedInstance.apiGetVotesSummary(
//type: "like",
//projectId: projectId.description
//).then { data -> Void in
//let voteData = try JSON(data: data).array
//self.assetVotes = voteData?.reduce(into: [Int: Int]()) { acc, data in
//let assetId = data["asset_id"].int!
//let votes = data["asset_votes"].int!
//acc[assetId] = votes
//}
//}
//}
//}