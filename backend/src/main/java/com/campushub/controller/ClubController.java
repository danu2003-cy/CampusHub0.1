
package com.campushub.controller;

import com.campushub.dto.ClubDto;
import com.campushub.dto.ClubMemberDto;
import com.campushub.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Club management.
 */
@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    @Autowired
    private ClubService clubService;

    @GetMapping
    public ResponseEntity<List<ClubDto>> getAllClubs() {
        return ResponseEntity.ok(clubService.getAllClubs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubDto> getClubById(@PathVariable Long id) {
        return ResponseEntity.ok(clubService.getClubById(id));
    }

    @PostMapping
    public ResponseEntity<ClubDto> createClub(
            @RequestBody ClubDto clubDto) {

        return ResponseEntity.ok(
                clubService.createClub(clubDto)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClubDto> updateClub(
            @PathVariable Long id,
            @RequestBody ClubDto clubDto) {

        return ResponseEntity.ok(
                clubService.updateClub(id, clubDto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClub(
            @PathVariable Long id) {

        clubService.deleteClub(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{clubId}/members/{userId}")
    public ResponseEntity<ClubMemberDto> joinClub(
            @PathVariable Long clubId,
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                clubService.joinClub(clubId, userId)
        );
    }

    @DeleteMapping("/{clubId}/members/{userId}")
    public ResponseEntity<Void> leaveClub(
            @PathVariable Long clubId,
            @PathVariable Long userId) {

        clubService.leaveClub(clubId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{clubId}/members")
    public ResponseEntity<List<ClubMemberDto>> getClubMembers(
            @PathVariable Long clubId) {

        return ResponseEntity.ok(
                clubService.getClubMembers(clubId)
        );
    }
}