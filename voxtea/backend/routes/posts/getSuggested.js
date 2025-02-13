router.get('/suggested', authMiddleware, async (req, res) => {
  try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate('interestedHashtags');

      if (!user.interestedHashtags.length) {
          return res.status(200).json([]);
      }

      const suggestedPosts = await Post.find({ hashtags: { $in: user.interestedHashtags } }).populate('userId');
      res.status(200).json(suggestedPosts);
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch suggested posts', error });
  }
});
