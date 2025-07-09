const Listing = require("../models/listing");
const NodeGeocoder = require("node-geocoder");

const geocoder = NodeGeocoder({
  provider: "opencage",
  apiKey: process.env.OPENCAGE_API_KEY,
});

module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing doesn't exist!");
      return res.redirect("/listings");
    }

    // Determine coordinates to pass to Leaflet
    let coords = null;
    if (listing.geometry && listing.geometry.coordinates?.length === 2) {
      coords = {
        lat: listing.geometry.coordinates[1], // latitude
        lon: listing.geometry.coordinates[0], // longitude
      };
    } else if (listing.location) {
      try {
        const geoData = await geocoder.geocode(listing.location);
        if (geoData && geoData.length > 0) {
          coords = {
            lat: geoData[0].latitude,
            lon: geoData[0].longitude,
          };
        }
      } catch (geoErr) {
        console.warn("⚠️ Geocoding failed:", geoErr.message);
      }
    }

    res.render("listings/show.ejs", {
      listing,
      coords,
    });
  } catch (err) {
    console.error("❌ Error in showListing:", err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
};

module.exports.createListing = async (req, res, next) => {
  try {
    const { location } = req.body.listing;

    // Geocode user input location dynamically
    const geoData = await geocoder.geocode(location);

    let geometry = {};
    if (geoData && geoData.length > 0) {
      geometry = {
        type: "Point",
        coordinates: [geoData[0].longitude, geoData[0].latitude], // GeoJSON expects [lng, lat]
      };
    }

    let url = req.file?.path || "";
    let filename = req.file?.filename || "";

    const newListing = new Listing({
      ...req.body.listing,
      owner: req.user._id,
      image: { url, filename },
      geometry,
    });

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("❌ Error in createListing:", err);
    req.flash("error", "Failed to create listing.");
    res.redirect("/listings/new");
  }
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesn't exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListings = async (req, res) => {
  try {
    const { id } = req.params;
    const { location } = req.body.listing;

    // Find listing
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // Update fields
    Object.assign(listing, req.body.listing);

    // If location updated, update geometry accordingly
    if (location && location !== listing.location) {
      const geoData = await geocoder.geocode(location);
      if (geoData && geoData.length > 0) {
        listing.geometry = {
          type: "Point",
          coordinates: [geoData[0].longitude, geoData[0].latitude],
        };
      }
    }

    // Update image if new file uploaded
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await listing.save();
    req.flash("success", "Listing Edited!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("❌ Error in updateListings:", err);
    req.flash("error", "Failed to update listing.");
    res.redirect(`/listings/${req.params.id}/edit`);
  }
};

module.exports.destroyListings = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
